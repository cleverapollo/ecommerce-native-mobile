import UIKit
import WebKit

class WebViewController: UIView, WKNavigationDelegate {
    
    var webView: WKWebView!
    let webUrl: URL
    let productImageViewController: ProductImageViewController
    
    init(webUrl: URL, productImageViewController: ProductImageViewController) {
        self.webUrl = webUrl
        self.productImageViewController = productImageViewController
        super.init(frame: CGRect(origin: CGPoint(x: 0, y: 0), size: CGSize(width: 50, height: 50)))
        
        webView = WKWebView()
        webView.navigationDelegate = self
    }
    
    required init?(coder: NSCoder) {
        self.webUrl = URL(string: "https://wantic.io")!
        self.productImageViewController = ProductImageViewController()
        super.init(coder: coder)
    }
    
    func loadWebUrl(_ productUrl: URL) {
        webView.load(URLRequest(url: productUrl))
        webView.allowsBackForwardNavigationGestures = true
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        var productInfos: [ProductInfo] = []
        if let javaScriptSource = loadJsFileToFetchProductInfos() {
            webView.evaluateJavaScript(javaScriptSource, completionHandler: { (result, error) in
                if error == nil, let productInfosArray = result as? [Dictionary<String, Any>] {
                    var productInfoId: UInt = 0
                    for item in productInfosArray {
                        productInfoId += 1
                        guard let imageUrlString = self.getImageUrlStringFromDict(item) else { continue }
                        let priceAmount = self.getPriceFromDict(item)
                        let name = self.getNameFromDict(item)
                        let productInfo = ProductInfo(id: productInfoId, productUrl: self.webUrl.absoluteString, imageUrl: imageUrlString, name: name, price: Price(amount: priceAmount))
                        productInfos.append(productInfo)
                    }
                    if productInfos.isEmpty && self.productImageViewController.productInfos.isEmpty  {
                        self.productImageViewController.reloadViewRemoveActivityIndicator()
                        self.showNoImagesFoundAlert()
                    } else {
                        self.productImageViewController.productInfos = productInfos
                        self.productImageViewController.reloadViewRemoveActivityIndicator()
                    }
                } else {
                    self.productImageViewController.reloadViewRemoveActivityIndicator()
                    if productInfos.isEmpty && self.productImageViewController.productInfos.isEmpty  {
                        self.showNoImagesFoundAlert()
                    }
                }
            })
        } else {
            self.productImageViewController.reloadViewRemoveActivityIndicator()
        }
    }
    
    private func showNoImagesFoundAlert() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            let alert = Alert.get(.noImagesFound(vc: self.productImageViewController))
            self.productImageViewController.present(alert, animated: true)
        }
    }
    
    private func loadJsFileToFetchProductInfos() -> String? {
        if let filePath = Bundle.main.path(forResource: "fetch-product-infos", ofType: "js") {
            do {
                return try String(contentsOfFile: filePath)
            } catch {
                return nil
            }
        }
        return nil
    }
    
    func getPriceFromDict(_ item: [String : Any]) -> Decimal {
        var priceAmount: Decimal = 0.00
        if let doublePrice = item["price"] as? Double  {
            priceAmount = Decimal(doublePrice)
        } else if let decimalPrice = item["price"] as? Decimal {
            priceAmount = decimalPrice
        }
        return priceAmount
    }
    
    func getImageUrlStringFromDict(_ item: [String : Any]) -> String? {
        return item["imageUrl"] as? String
    }
    
    func getNameFromDict(_ item: [String : Any]) -> String {
        return item["name"] as? String ?? ""
    }

}
