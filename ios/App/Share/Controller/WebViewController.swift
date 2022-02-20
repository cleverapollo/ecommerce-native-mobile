import UIKit
import WebKit

class WebViewController: UIView {
    
    var webView: WKWebView!
    let webUrl: URL
    
    var onWebCrawlerResult: (WebPageInfo?) -> Void
    
    // MARK: - life cycle
    
    init(webUrl: URL, onWebCrawlerResult: @escaping (WebPageInfo?) -> Void) {
        
        self.webUrl = webUrl
        self.onWebCrawlerResult = onWebCrawlerResult
        super.init(frame: CGRect(origin: CGPoint(x: 0, y: 0), size: CGSize(width: 50, height: 50)))
        
        webView = WKWebView()
        webView.navigationDelegate = self
    }
    
    required init?(coder: NSCoder) {
        
        self.webUrl = URL(string: "https://wantic.io")!
        self.onWebCrawlerResult = { _ in }
        super.init(coder: coder)
    }
    
    // MARK: - load web url
    
    func loadWebUrl(_ productUrl: URL) {
        
        webView.load(URLRequest(url: productUrl))
        webView.allowsBackForwardNavigationGestures = true
    }
}

// MARK: - WKNavigationDelegate

extension WebViewController: WKNavigationDelegate {
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        
        guard let javaScriptSource = File.getFileContent(.webCrawler) else {
            Logger.error("Error while reading web crawler script")
            self.onWebCrawlerResult(nil)
            return
        }
        
        webView.evaluateJavaScript(javaScriptSource, completionHandler: { (result, error) in
            
            guard error == nil else {
                Logger.error("Error while fetching results", error!)
                self.onWebCrawlerResult(nil)
                return
            }
            
            guard let resultDict = result as? [String: Any] else {
                Logger.error("No results from script: Result is ", result ?? "nil")
                self.onWebCrawlerResult(nil)
                return
            }
            
            self.onWebCrawlerResult(WebCrawler.getWebPageInfo(from: resultDict))
        })
    }
}
