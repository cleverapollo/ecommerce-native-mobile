//
//  WebViewController.swift
//  App
//
//  Created by Tim Fischer on 26.06.21.
//

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
                    for item in productInfosArray {
                        guard let imageUrlString = self.getImageUrlStringFromDict(item) else { continue }
                        let priceAmount = self.getPriceFromDict(item)
                        let name = self.getNameFromDict(item)
                        let productInfo = ProductInfo(productUrl: self.webUrl.absoluteString, imageUrl: imageUrlString, name: name, price: Price(amount: priceAmount))
                        productInfos.append(productInfo)
                    }
                    self.productImageViewController.productInfos = productInfos
                    self.productImageViewController.reloadViewRemoveActivityIndicator()
                } else {
                    self.productImageViewController.reloadViewRemoveActivityIndicator()
                }
            })
        } else {
            self.productImageViewController.reloadViewRemoveActivityIndicator()
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
