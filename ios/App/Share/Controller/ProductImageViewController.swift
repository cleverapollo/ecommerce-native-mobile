import UIKit
import BetterSegmentedControl
import MobileCoreServices

private let reuseIdentifier = "ProductInfoCell"

class ProductInfoCell: UICollectionViewCell {
    
    @IBOutlet weak var image: UIImageView!
    
}

class ProductImageViewController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    
    // MARK: - Views
    @IBOutlet weak var navigationBar: DesignableNavigationItem!
    @IBOutlet weak var headerView: UIView!
    
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var headerTitle: UILabel!
    
    @IBOutlet weak var nextButton: UIButton!
    
    @IBOutlet weak var noImagesFoundView: UIView!
    @IBOutlet weak var noImageConstraint: NSLayoutConstraint!
    
    @IBOutlet weak var closeButton: UIBarButtonItem!
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: {_ in
            WishDataStore.shared.reset()
            ProductDataStore.shared.reset()
        })
    }
    
    @IBOutlet weak var segmentController: BetterSegmentedControl!
    @IBOutlet weak var heightSegmentConstraint: NSLayoutConstraint!
    
    private var loadingIndicatorView: UIVisualEffectView?
    
    // MARK: - properties
    
    private let authService = AuthService.shared
    
    private var items: [WebPageImage] = []
    private var itemsToDelete: [IndexPath: WebPageImage] = [:]
    
    var selectedImage: WebPageImage?
    var selectedCell: ProductInfoCell?
    var webPageInfo: WebPageInfo? {
        didSet {
            self.items = self.webPageInfo?.images ?? []
            self.reloadCollectionView()
            self.enableNextButton(true)
            self.showNoImagesFoundView(self.items.isEmpty)
            self.updateWish()
        }
    }
    
    private func updateWish() {
        guard let webPageInfo = webPageInfo else {
            return
        }
        var webPageImage: WebPageImage?
        if let selectedImage = self.selectedImage {
            webPageImage = selectedImage
        }
        if segmentController.index == 0 {
            WishDataStore.shared.update(Wish(webPageInfo, webPageImage: webPageImage))
        } else {
            ProductDataStore.shared.update(ProductRequest(webPageInfo, webPageImage: webPageImage))
        }
    }
    
    // MARK: - lifecycle
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        authService.getAuthToken() { [weak self] idToken in
            guard let self = self else { return }
            if idToken == nil {
                Alert.present(.unauthorized, on: self)
            } else if let item = self.extensionContext?.inputItems.first as? NSExtensionItem {
                self.fetchProductInfos(extensionItem: item)
            }
        }
        WishDataStore.shared.reset()
        ProductDataStore.shared.reset()
        
        FirebaseAnalytics.logScreenEvent("share_extension-picture")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupActionButton()
        setupSegmentButton()
        setupTitleImage()
        showNoImagesFoundView(false)
        
        collectionView.delegate = self
        collectionView.dataSource = self
    }
    
    private func setupActionButton() {
        nextButton.applyOrangeGradient()
        enableNextButton(false)
    }
    
    private func setupTitleImage() {
        navigationBar.updateView(self.segmentController.index == 0 ? Icon.get(.logo) : Icon.get(.logoCreator))
    }
    
    private func enableNextButton(_ enable: Bool) {
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.nextButton.isEnabled = enable
        }
    }
    
    private func showNoImagesFoundView(_ show: Bool) {
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.noImagesFoundView.isHidden = !show
            self.noImageConstraint.constant = show ? 48 : 0
        }
    }
    
    private func setupSegmentButton() {
        segmentController.segments = LabelSegment.segments(withTitles: ["PRIVAT", "CREATOR"],
                                                           normalFont:UIFont.systemFont(ofSize: 10, weight: UIFont.Weight.bold),
                                                           normalTextColor: UIColor(hex: "#3E3E3E"),
                                                           selectedFont: UIFont.systemFont(ofSize: 10, weight: UIFont.Weight.bold),
                                                           selectedTextColor: .white
                                                           
        )
        segmentController.indicatorView.applyOrangeGradient()
        ProfileResource.getProfile(completionHandler: { result in
            DispatchQueue.main.async { [weak self] in
                switch result {
                case .success(let response):
                    let profile = response.data
                    self?.heightSegmentConstraint.constant = profile.creatorAccount != nil ? 40 : 0
                    self?.segmentController.isHidden = profile.creatorAccount == nil
                case .failure(_):
                    self?.heightSegmentConstraint.constant = 0
                }
            }
            
        })
        
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return webPageInfo?.images.count ?? 0
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        guard let cell = collectionView.dequeueReusableCell(withReuseIdentifier: reuseIdentifier, for: indexPath) as? ProductInfoCell else {
            return UICollectionViewCell()
        }
        
        guard let image = webPageInfo?.images[indexPath.row] else {
            return UICollectionViewCell()
        }
        
        // Remove elements that could not be loaded to prevent blank images.
        let imageLoaded = cell.image.setImageFromURl(imageUrlString: image.url)
        if !imageLoaded {
            itemsToDelete[indexPath] = image
        }
        
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        guard let webPageInfo = webPageInfo else {
            return
        }
        
        let cell = collectionView.cellForItem(at: indexPath) as! ProductInfoCell
        let webPageImage = webPageInfo.images[indexPath.row]
        
        let cellIsSelectedCell = selectedCell == cell
        
        cell.layer.borderWidth = cellIsSelectedCell ? 0.0 : 2.0
        cell.layer.borderColor = UIColor(hex: "#3E3E3E")?.cgColor
        
        selectedCell = cellIsSelectedCell ? nil : cell
        selectedImage = cellIsSelectedCell ? nil : webPageImage
        
        if segmentController.index == 0 {
            WishDataStore.shared.update(Wish(webPageInfo, webPageImage: webPageImage))
        } else {
            ProductDataStore.shared.update(ProductRequest(webPageInfo, webPageImage: webPageImage))
        }
        
    }
    
    func collectionView(_ collectionView: UICollectionView, didDeselectItemAt indexPath: IndexPath) {
        let cell = collectionView.cellForItem(at: indexPath)
        cell?.layer.borderWidth = 2.0
        cell?.layer.borderColor = UIColor.white.cgColor
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let width = view.frame.size.width
        // in case you you want the cell to be 40% of your controllers view
        return CGSize(width: (width - 66)/2, height: (width - 66)/2)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, referenceSizeForHeaderInSection section: Int) -> CGSize {
        return CGSize(width: 0, height: 0)
    }
    
    func fetchProductInfos(extensionItem: NSExtensionItem) {
        // web page
        let propertyList = String(kUTTypePropertyList)
        // third party apps
        let url = String(kUTTypeURL)
        let text = String(kUTTypeText)
        
        for attachment in extensionItem.attachments! {
            if attachment.hasItemConformingToTypeIdentifier(propertyList) {
                fetchProductInfosFromWebPage(attachment)
            } else if attachment.hasItemConformingToTypeIdentifier(url) {
                attachment.loadItem(forTypeIdentifier: url, options: nil, completionHandler: { (item, error) in
                    if let urlContent = item as? URL {
                        self.fetchProductInfosFromWebView(urlContent)
                    }
                })
            } else if attachment.hasItemConformingToTypeIdentifier(text) {
                attachment.loadItem(forTypeIdentifier: text, options: nil, completionHandler: { (item, error) in
                    if let textContent = item as? String, let webUrl = self.getProductUrlFromProductDescription(textContent)  {
                        self.fetchProductInfosFromWebView(webUrl)
                    }
                })
            }
        }
    }
    
    func fetchProductInfosFromWebPage(_ attachment: NSItemProvider) {
        showLoadingIndicator(with: "Wir durchsuchen derzeit die Seite nach Bildern \n hab noch einen kurzen Moment Geduld.")
        attachment.loadItem(
            forTypeIdentifier: String(kUTTypePropertyList),
            options: nil,
            completionHandler: { [weak self] (item, error) -> Void in
                guard let self = self else { return }
                guard let dictionary = item as? NSDictionary, let results = dictionary[NSExtensionJavaScriptPreprocessingResultsKey] as? [String: Any] else {
                    self.reloadCollectionView()
                    Alert.present(.noImagesFound, on: self)
                    return
                }
                self.webPageInfo = WebCrawler.getWebPageInfo(from: results)
            }
        )
    }
    
    func fetchProductInfosFromWebView(_ productUrl: URL?) {
        guard let webUrl = productUrl, webUrl.absoluteString.starts(with: "https://") else {
            Logger.error("Web url isn't conform to https protocol. URL is ", productUrl ?? "")
            return
        }
        showLoadingIndicator(with: "Wir durchsuchen derzeit die Seite nach Bildern \n hab noch einen kurzen Moment Geduld.")
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            let webView = WebViewController(webUrl: webUrl) { webPageInfo in
                guard let webPageInfo = webPageInfo else {
                    self.reloadCollectionView()
                    Alert.present(.noImagesFound, on: self)
                    return
                }
                self.webPageInfo = webPageInfo
            }
            self.view.addSubview(webView)
            webView.loadWebUrl(webUrl)
        }
    }
    
    func getProductUrlFromProductDescription(_ description: String) -> URL? {
        var imageUrl: URL? = nil
        let detector = try! NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
        let matches = detector.matches(in: description, options: [], range: NSRange(location: 0, length: description.utf16.count))
        
        for match in matches {
            guard let range = Range(match.range, in: description) else { continue }
            let urlString = description[range]
            Logger.debug("URL parsed from description: ", urlString)
            if let url = URL(string: String(urlString)) {
                imageUrl = url
                break
            }
        }
        return imageUrl
    }
    
    func reloadCollectionView() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.collectionView.reloadData()
            self.collectionView.performBatchUpdates(nil) { (result) in
                // ready
                if !self.itemsToDelete.isEmpty {
                    for itemToDelete in self.itemsToDelete {
                        self.items.removeAll(where: { $0 == itemToDelete.value })
                    }
                    self.collectionView.deleteItems(at: self.itemsToDelete.compactMap { $0.key })
                }
                self.stopLoadingIndicator()
            }
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
        let width = view.frame.size.width
        let cellWidth = width * 0.425
        let cellsInRow: CGFloat = 2
        
        let totalCellWidth = cellWidth * cellsInRow
        let totalSpacingWidth = 14.0 * (cellsInRow - 1)
        
        let leftInset = (collectionView.frame.width - CGFloat(totalCellWidth + totalSpacingWidth)) / 2
        let rightInset = leftInset
        return UIEdgeInsets(top: 10, left: leftInset, bottom: 10, right: rightInset)
    }
    
    private func presentAlert(_ alert: UIAlertController) {
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.present(alert, animated: true)
        }
    }
    
    // MARK: - Segment Change
    @IBAction func segmentChanged(_ sender: Any) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.segmentController.indicatorView.layer.sublayers?.removeFirst()
            self.nextButton.layer.sublayers?.removeFirst()
            setupTitleImage()
            if (self.segmentController.index == 0) {
                self.segmentController.indicatorView.applyOrangeGradient()
                self.nextButton.applyOrangeGradient()
                self.headerTitle.text = "Wunsch auswählen"
            } else {
                self.segmentController.indicatorView.applyPurpleGradient()
                self.nextButton.applyPurpleGradient()
                self.headerTitle.text = "Produkt auswählen"
            }
        }
        
    }
    
    // MARK: - Navigate to create page
    
    @IBAction func openCreatePage(_ sender: Any) {
        guard let webPageInfo = webPageInfo else {
            return
        }
        if (self.segmentController.index == 0) {
            let vc =  UIStoryboard.editDetailsViewController()
            if let selectedImage = self.selectedImage {
                vc?.webPageImage = selectedImage
            }
            vc?.webPageInfo = webPageInfo
            self.navigationController?.pushViewController(vc!, animated: true)
        } else {
            let vc =  UIStoryboard.createProductViewController()
            if let selectedImage = self.selectedImage {
                vc?.webPageImage = selectedImage
            }
            vc?.webPageInfo = webPageInfo
            self.navigationController?.pushViewController(vc!, animated: true)
        }
    }
    
    
}

// MARK: - Loading Indicator

extension ProductImageViewController {
    
    private func showLoadingIndicator(with text: String) {
        
        if let indicatorView = loadingIndicatorView {
            removeActivityIndicator(indicatorView)
        }
        let loadingIndicator = createActivityIndicatorView(with: text)
        showActivityIndicator(loadingIndicator)
        loadingIndicatorView = loadingIndicator
    }
    
    private func stopLoadingIndicator() {
        
        guard let indicatorView = loadingIndicatorView else {
            return
        }
        removeActivityIndicator(indicatorView)
        loadingIndicatorView = nil
    }
    
}
