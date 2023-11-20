//
//  ProductListTableViewController.swift
//  App
//
//  Created by Alex on 19/11/2023.
//

import UIKit

class ProductListTableViewCell: UITableViewCell {

    static let identifier = "ProductListTableViewCell"
    static let sectionNumber = 1
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var checkMarkImageView: UIImageView!
}

class NewProductListTableViewCell: UITableViewCell {
    
    static let identifier = "NewProductListTableViewCell"
    static let sectionNumber = 0
    
    @IBOutlet weak var newProductListButton: NewWishListButton!
    @IBOutlet weak var newProductListTextField: NewWishListTextField!
    
    @IBAction func newProductListButtonPressed(_ sender: Any) {
        
        hideButton()
        showTextField()
    }
    
    // MARK: - TextField
    
    func hideTextField() {
        newProductListTextField.isHidden = true
    }
    
    func showTextField() {
        newProductListTextField.isHidden = false
        newProductListTextField.becomeFirstResponder()
    }
    
    // MARK: - Button
    
    func hideButton() {
        newProductListButton.isHidden = true
    }
    
    func showButton() {
        newProductListButton.isHidden = false
    }
}

enum ProductListsLoadingState {
    
    case inProgress
    case none
    case error
    case done(productListCount: Int)
    
    func infoText() -> String? {
        var text: String? = nil
        switch self {
        case .inProgress:
            text = "Produkt werden geladen ..."
        case .done(let productListCount):
            if productListCount == 0 {
                text = "Das Produkt wurde deiner Liste hinzugefügt"
            }
        case .error:
            text = "Das Produkt konnte nicht hinzugefügt werden"
        case .none:
            text = nil
        }
        return text
    }
}

class ProductListTableViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var tableView: SelfSizedTableView!
    @IBOutlet weak var saveButton: UIButton!
    @IBOutlet weak var selectedProductImageView: UIImageView!
    
    @IBAction func onButtonTap() {
        saveNewProduct()
    }
    
    var newProductListTableViewCell: NewProductListTableViewCell? {
        let indexPath = IndexPath(row: 0, section: NewProductListTableViewCell.sectionNumber)
        return tableView.cellForRow(at: indexPath) as? NewProductListTableViewCell
    }
    
    var newProductListTextField: NewWishListTextField? {
        newProductListTableViewCell?.newProductListTextField
    }
    
    // ProductLists
    var productLists: [ProductList] = []
    var productListsLoadingState: ProductListsLoadingState = .none
    var productListId: UUID? {
        didSet {
            ProductDataStore.shared.product.productListId = productListId
            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                self.saveButton.isEnabled = ProductDataStore.shared.product.isValid
            }
        }
    }
    var selectedIndexPath: IndexPath?
    
    // MARK: - lifecycle
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        FirebaseAnalytics.logScreenEvent("share_extension-Productlist")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        productListId = ProductDataStore.shared.product.productListId
        setupImage()
        setupActionButton()
        setupTableView()
        loadProductLists()
    }
    
    private func setupImage() {
        
        if let imageUrl = ProductDataStore.shared.product.imageUrl {
            self.selectedProductImageView.setImageFromURl(imageUrlString: imageUrl)
        } else {
            self.selectedProductImageView.image = Image.get(.fallbackWishImage)
        }
    }
    
    private func setupTableView() {
        
        tableView.tableFooterView = UIView()
        tableView.separatorColor = Color.get(.separatorColor)
        // add spacing below the table view
        tableView.contentInset = Constants.tableViewInsets
    }
    
    private func setupActionButton() {
        saveButton.isEnabled = ProductDataStore.shared.product.isValid
        saveButton.applyCreatorGradient()
    }
    
    private func selectFirstProductList() {
        
        self.productListId = self.productLists.first?.id
        self.selectedIndexPath = IndexPath(row: 0, section: ProductListTableViewCell.sectionNumber)
    }
    
    private func reloadTableViewData() {
        
        DispatchQueue.main.async {
            self.tableView.reloadData()
        }
    }

    // MARK: - Table view data source

    func numberOfSections(in tableView: UITableView) -> Int {
        return 2
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        switch section {
        case NewProductListTableViewCell.sectionNumber:
            return 1
        case ProductListTableViewCell.sectionNumber:
            if productLists.isEmpty {
                // show hint that the user has no Product lists
                return 1
            }
            return productLists.count
        default:
            return 0
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        switch indexPath.section {
        case NewProductListTableViewCell.sectionNumber:
            return setupNewProductListTableViewCells(tableView, cellForRowAt: indexPath)
        case ProductListTableViewCell.sectionNumber:
            return setupProductListTableViewCells(tableView, cellForRowAt: indexPath)
        default:
            return UITableViewCell()
        }
    }
    
    private func setupNewProductListTableViewCells(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: NewProductListTableViewCell.identifier, for: indexPath) as? NewProductListTableViewCell else {
            return UITableViewCell()
        }
        
        // setup action handler
        cell.newProductListTextField.onButtonClick = { ProductListName in
            self.saveNewProductList(ProductListName: ProductListName)
        }
        
        // setup corners
        cell.layer.cornerRadius = Constants.cornerRadius
        cell.layer.maskedCorners = [.layerMinXMinYCorner,.layerMaxXMinYCorner]
        cell.newProductListButton.setImage(UIImage(resource: .add).withTintColor(Color.get(.gradientCreatorEnd)), for: .normal)
        
        return cell
    }

    private func setupProductListTableViewCells(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: ProductListTableViewCell.identifier, for: indexPath) as? ProductListTableViewCell else {
            return UITableViewCell()
        }
        
        let ProductListIndex = indexPath.row
        let isFirstRow = ProductListIndex == 0
        var isLastRow = false
        
        if !productLists.isEmpty {
            isLastRow = ProductListIndex == productLists.count - 1
            
            // setup text
            let productList = productLists[ProductListIndex]
            cell.nameLabel.text = productList.name
            
            // setup check mark
            cell.checkMarkImageView.isHidden = false
            if productList.id == productListId {
                cell.checkMarkImageView.image = Icon.get(.creatorChecked )
            } else {
                cell.checkMarkImageView.image = Icon.get(.unchecked)
            }
        } else {
            isLastRow = true
            
            cell.nameLabel.text = productListsLoadingState.infoText()
            cell.checkMarkImageView.isHidden = true
        }
        
        // setup style
        cell.clipsToBounds = isLastRow || isFirstRow
        cell.layer.cornerRadius = isLastRow ? Constants.cornerRadius : 0
        cell.layer.maskedCorners = isLastRow ? [.layerMinXMaxYCorner,.layerMaxXMaxYCorner] : []
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        guard !productLists.isEmpty else { return }
        
        let productList = productLists[indexPath.row]
        
        var indexPathsToReload = [indexPath]
        if selectedIndexPath != nil {
            indexPathsToReload.append(selectedIndexPath!)
        }
        
        selectedIndexPath = productList.id == productListId ? nil : indexPath
        productListId = productList.id == productListId ? nil : productList.id
        tableView.reloadRows(at: indexPathsToReload, with: .automatic)
    }
    
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        
        extensionContext?.completeRequest(returningItems: nil, completionHandler: {_ in
            ProductDataStore.shared.reset()
        })
    }
}

// MARK: - Network

extension ProductListTableViewController {
    
    // MARK: - Save new Product list
    
    private func saveNewProductList(ProductListName: String) {
        
        showLoadingSpinnerInTextField()
        
        let requestBody = ProductListCreateRequest(name: ProductListName)
        ProductListResource.createProductList(requestBody) { result in
            self.dismissLoadingSpinnerInTextField()
            switch result {
            case .success(let response):
                let newProductList = response.data
                self.toggleNewProductListUIViews()
                self.productLists.insert(newProductList, at: 0)
                self.selectFirstProductList()
                self.reloadTableViewData()
            case .failure(let error):
                self.handleCreateNewProductListError(error, ProductListName: ProductListName)
            }
        }
    }
    
    private func dismissLoadingSpinnerInTextField() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.newProductListTextField?.dismissLoading()
        }
    }
    
    private func showLoadingSpinnerInTextField() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.newProductListTextField?.showLoading()
        }
    }
    
    private func toggleNewProductListUIViews() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.newProductListTextField?.clearTextField()
            self.newProductListTableViewCell?.hideTextField()
            self.newProductListTableViewCell?.showButton()
        }
    }
    
    // MARK: - Load Product lists
    
    private func loadProductLists() {
        
        productListsLoadingState = .inProgress
        ProductListResource.queryProductLists() { result in
            switch result {
            case .success(let response):
                let productLists = response.data
                self.productListsLoadingState = .done(productListCount: productLists.count)
                self.productLists = productLists
                self.selectFirstProductList()
            case .failure(let error):
                self.productLists = []
                self.productListsLoadingState = .error
                self.handleLoadProductListsError(error)
            }
            self.reloadTableViewData()
        }
    }
    
    // MARK: - Save new Product
    
    private func saveNewProduct() {
        
        let product = ProductDataStore.shared.product
        ProductResource.createProduct(product) { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .success(_):
                Alert.present(.addedProductSuccessful(productListId: product.productListId!), on: self)
            case .failure(let error):
                self.handleSaveProductError(error, Product: product)
            }
        }
    }
    
}

// MARK: Error Handling

extension ProductListTableViewController {
    
    private func handleLoadProductListsError(_ error: NetworkError) {
        
        let message = "Beim Laden deiner Produktlisten ist ein Fehler aufgetreten."
        handleError(error, message: message) { [weak self] _ in
            
            guard let self = self else { return }
            self.loadProductLists()
        }
    }
    
    private func handleCreateNewProductListError(_ error: NetworkError, ProductListName: String) {
        
        let message = "Beim Speichern deiner Produktliste ist ein Fehler aufgetreten."
        handleError(error, message: message) { [weak self] _ in
            
            guard let self = self else { return }
            self.saveNewProductList(ProductListName: ProductListName)
        }
    }
    
    private func handleSaveProductError(_ error: NetworkError, Product: ProductRequest) {
        
        let message = "Das Produkt konnte nicht hinzugefügt werden"
        handleError(error, message: message) { [weak self] _ in
            
            guard let self = self else { return }
            self.saveNewProduct()
        }
    }
    
    private func handleError(_ error: NetworkError, message: String, retryAction: @escaping (UIAlertAction) -> Void) {

        switch error {
        case .unauthorized:
            Alert.present(.unauthorized, on: self)
        case .unexpected(_), .general:
            Alert.present(.generalError(message: message, retryAction: retryAction), on: self)
        }
    }
}
