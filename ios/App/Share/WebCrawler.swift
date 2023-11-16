import Foundation

struct WebCrawler {
    
    static func getWebPageInfo(from dict: [String : Any]) -> WebPageInfo {
        
        WebPageInfo(title: getStringValue(dict, key: "title"),
                    url: getStringValue(dict, key: "url"),
                    price: getPrice(dict), coupon: nil,
                    images: getImages(dict))
    }
    
    private static func getPrice(_ item: [String : Any]) -> Price {
        
        var priceAmount: Decimal = 0.00
        if let doublePrice = item["price"] as? Double  {
            priceAmount = Decimal(doublePrice)
        } else if let decimalPrice = item["price"] as? Decimal {
            priceAmount = decimalPrice
        }
        return Price(amount: priceAmount)
    }
    
    private static func getImages(_ item: [String : Any]) -> [WebPageImage] {
        
        guard let images = item["images"] as? [[String : Any]] else {
            return []
        }
        return images.compactMap(WebPageImage.init)
            .filter { !$0.url.isEmpty }
    }
    
    private static func getStringValue(_ item: [String : Any], key: String) -> String {
        
        item[key] as? String ?? ""
    }
    
}
