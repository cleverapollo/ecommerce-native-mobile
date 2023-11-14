import Foundation

struct WebPageInfo: CustomStringConvertible {
    
    let title: String
    let url: String
    let price: Price
    let images: [WebPageImage]
    
    // MARK: CustomStringConvertible
    
    var description: String {
        "title: \(title) | url: \(url) | price: \(price.amount.formattedAmount) | numberOfImages: \(images.count)"
    }
}
