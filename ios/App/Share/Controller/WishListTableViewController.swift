import UIKit

class WishListTableViewCell: UITableViewCell {

    static let identifier = "WishListTableViewCell"
    static let sectionNumber = 1
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var checkMarkImageView: UIImageView!
}

class NewWishListTableViewCell: UITableViewCell {
    
    static let identifier = "NewWishListTableViewCell"
    static let sectionNumber = 0
    
    @IBOutlet weak var newWishListButton: NewWishListButton!
    @IBOutlet weak var newWishListTextField: NewWishListTextField!
    
    @IBAction func newWishListButtonPressed(_ sender: Any) {
        
        hideButton()
        showTextField()
    }
    
    // MARK: - TextField
    
    func hideTextField() {
        newWishListTextField.isHidden = true
    }
    
    func showTextField() {
        newWishListTextField.isHidden = false
        newWishListTextField.becomeFirstResponder()
    }
    
    // MARK: - Button
    
    func hideButton() {
        newWishListButton.isHidden = true
    }
    
    func showButton() {
        newWishListButton.isHidden = false
    }
}

enum WishListsLoadingState {
    
    case inProgress
    case none
    case error
    case done(wishListCount: Int)
    
    func infoText() -> String? {
        var text: String? = nil
        switch self {
        case .inProgress:
            text = "Wunschlisten werden geladen ..."
        case .done(let wishListCount):
            if wishListCount == 0 {
                text = "Keine Wunschlisten vorhanden"
            }
        case .error:
            text = "Fehler beim Laden deiner Wunschlisten"
        case .none:
            text = nil
        }
        return text
    }
}

class WishListTableViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var tableView: SelfSizedTableView!
    @IBOutlet weak var saveButton: UIButton!
    @IBOutlet weak var selectedWishImageView: UIImageView!
    
    @IBAction func onButtonTap() {
        saveNewWish()
    }
    
    var newWishListTableViewCell: NewWishListTableViewCell? {
        let indexPath = IndexPath(row: 0, section: NewWishListTableViewCell.sectionNumber)
        return tableView.cellForRow(at: indexPath) as? NewWishListTableViewCell
    }
    
    var newWishListTextField: NewWishListTextField? {
        newWishListTableViewCell?.newWishListTextField
    }
    
    // WishLists
    var wishLists: [WishList] = []
    var wishListsLoadingState: WishListsLoadingState = .none
    var wishListId: UUID? {
        didSet {
            WishDataStore.shared.wish.wishListId = wishListId
            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                self.saveButton.isEnabled = WishDataStore.shared.wish.isValid
            }
        }
    }
    var selectedIndexPath: IndexPath?
    
    // MARK: - lifecycle
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        FirebaseAnalytics.logScreenEvent("share_extension-wishlist")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        wishListId = WishDataStore.shared.wish.wishListId
        
        setupImage()
        setupActionButton()
        setupTableView()
        
        loadWishLists()
    }
    
    private func setupImage() {
        
        if let imageUrl = WishDataStore.shared.wish.imageUrl {
            self.selectedWishImageView.setImageFromURl(imageUrlString: imageUrl)
        } else {
            self.selectedWishImageView.image = Image.get(.fallbackWishImage)
        }
    }
    
    private func setupTableView() {
        
        tableView.tableFooterView = UIView()
        tableView.separatorColor = Color.get(.separatorColor)
        // add spacing below the table view
        tableView.contentInset = Constants.tableViewInsets
    }
    
    private func setupActionButton() {
        
        saveButton.isEnabled = WishDataStore.shared.wish.isValid
        saveButton.applyGradient()
    }
    
    private func selectFirstWishList() {
        
        self.wishListId = self.wishLists.first?.id
        self.selectedIndexPath = IndexPath(row: 0, section: WishListTableViewCell.sectionNumber)
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
        case NewWishListTableViewCell.sectionNumber:
            return 1
        case WishListTableViewCell.sectionNumber:
            if wishLists.isEmpty {
                // show hint that the user has no wish lists
                return 1
            }
            return wishLists.count
        default:
            return 0
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        switch indexPath.section {
        case NewWishListTableViewCell.sectionNumber:
            return setupNewWishListTableViewCells(tableView, cellForRowAt: indexPath)
        case WishListTableViewCell.sectionNumber:
            return setupWishListTableViewCells(tableView, cellForRowAt: indexPath)
        default:
            return UITableViewCell()
        }
    }
    
    private func setupNewWishListTableViewCells(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: NewWishListTableViewCell.identifier, for: indexPath) as? NewWishListTableViewCell else {
            return UITableViewCell()
        }
        
        // setup action handler
        cell.newWishListTextField.onButtonClick = { wishListName in
            self.saveNewWishList(wishListName: wishListName)
        }
        
        // setup corners
        cell.layer.cornerRadius = Constants.cornerRadius
        cell.layer.maskedCorners = [.layerMinXMinYCorner,.layerMaxXMinYCorner]
        
        return cell
    }

    private func setupWishListTableViewCells(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: WishListTableViewCell.identifier, for: indexPath) as? WishListTableViewCell else {
            return UITableViewCell()
        }
        
        let wishListIndex = indexPath.row
        let isFirstRow = wishListIndex == 0
        var isLastRow = false
        
        if !wishLists.isEmpty {
            isLastRow = wishListIndex == wishLists.count - 1
            
            // setup text
            let wishList = wishLists[wishListIndex]
            cell.nameLabel.text = wishList.name
            
            // setup check mark
            cell.checkMarkImageView.isHidden = false
            if wishList.id == wishListId {
                cell.checkMarkImageView.image = Icon.get(.checkMark)
            } else {
                cell.checkMarkImageView.image = Icon.get(.unchecked)
            }
        } else {
            isLastRow = true
            
            cell.nameLabel.text = wishListsLoadingState.infoText()
            cell.checkMarkImageView.isHidden = true
        }
        
        // setup style
        cell.clipsToBounds = isLastRow || isFirstRow
        cell.layer.cornerRadius = isLastRow ? Constants.cornerRadius : 0
        cell.layer.maskedCorners = isLastRow ? [.layerMinXMaxYCorner,.layerMaxXMaxYCorner] : []
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        guard !wishLists.isEmpty else { return }
        
        let wishList = wishLists[indexPath.row]
        
        var indexPathsToReload = [indexPath]
        if selectedIndexPath != nil {
            indexPathsToReload.append(selectedIndexPath!)
        }
        
        selectedIndexPath = wishList.id == wishListId ? nil : indexPath
        wishListId = wishList.id == wishListId ? nil : wishList.id
        tableView.reloadRows(at: indexPathsToReload, with: .automatic)
    }
    
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        
        extensionContext?.completeRequest(returningItems: nil, completionHandler: {_ in
            WishDataStore.shared.reset()
        })
    }
}

// MARK: - Network

extension WishListTableViewController {
    
    // MARK: - Save new wish list
    
    private func saveNewWishList(wishListName: String) {
        
        showLoadingSpinnerInTextField()
        
        let requestBody = WishListCreateRequest(name: wishListName)
        WishListResource.createWishList(requestBody) { result in
            self.dismissLoadingSpinnerInTextField()
            switch result {
            case .success(let response):
                let newWishList = response.data
                self.toggleNewWishListUIViews()
                self.wishLists.insert(newWishList, at: 0)
                self.selectFirstWishList()
                self.reloadTableViewData()
            case .failure(let error):
                self.handleCreateNewWishListError(error, wishListName: wishListName)
            }
        }
    }
    
    private func dismissLoadingSpinnerInTextField() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.newWishListTextField?.dismissLoading()
        }
    }
    
    private func showLoadingSpinnerInTextField() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.newWishListTextField?.showLoading()
        }
    }
    
    private func toggleNewWishListUIViews() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.newWishListTextField?.clearTextField()
            self.newWishListTableViewCell?.hideTextField()
            self.newWishListTableViewCell?.showButton()
        }
    }
    
    // MARK: - Load wish lists
    
    private func loadWishLists() {
        
        wishListsLoadingState = .inProgress
        WishListResource.queryWishLists() { result in
            switch result {
            case .success(let response):
                let wishLists = response.data
                self.wishListsLoadingState = .done(wishListCount: wishLists.count)
                self.wishLists = wishLists
                self.selectFirstWishList()
            case .failure(let error):
                self.wishLists = []
                self.wishListsLoadingState = .error
                self.handleLoadWishListsError(error)
            }
            self.reloadTableViewData()
        }
    }
    
    // MARK: - Save new wish
    
    private func saveNewWish() {
        
        let wish = WishDataStore.shared.wish
        WishResource.createWish(wish) { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .success(_):
                Alert.present(.addedWishSuccessful(wishListId: wish.wishListId!), on: self)
            case .failure(let error):
                self.handleSaveWishError(error, wish: wish)
            }
        }
    }
    
}

// MARK: Error Handling

extension WishListTableViewController {
    
    private func handleLoadWishListsError(_ error: NetworkError) {
        
        let message = "Beim Laden deiner Wunschlisten ist ein Fehler aufgetreten."
        handleError(error, message: message) { [weak self] _ in
            
            guard let self = self else { return }
            self.loadWishLists()
        }
    }
    
    private func handleCreateNewWishListError(_ error: NetworkError, wishListName: String) {
        
        let message = "Beim Speichern deiner Wunschliste ist ein Fehler aufgetreten."
        handleError(error, message: message) { [weak self] _ in
            
            guard let self = self else { return }
            self.saveNewWishList(wishListName: wishListName)
        }
    }
    
    private func handleSaveWishError(_ error: NetworkError, wish: Wish) {
        
        let message = "Beim Speichern deines Wunsches ist ein Fehler aufgetreten."
        handleError(error, message: message) { [weak self] _ in
            
            guard let self = self else { return }
            self.saveNewWish()
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
