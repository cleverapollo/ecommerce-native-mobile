import Foundation

// MARK: - Models

struct Wish: Codable {
    
    var id: UUID?
    var wishListId: UUID?
    var name: String?
    var note: String?
    var price: Price
    var productUrl: String?
    var imageUrl: String?
    var isFavorite: Bool = false
    
    var isValid: Bool {
        wishListId != nil && name != nil && productUrl != nil
    }
    
    init() {
        self.price = Price(amount: 0.00)
    }
    
    init(_ webPageInfo: WebPageInfo, webPageImage: WebPageImage?) {
        
        if let webPageImageName = webPageImage?.name, !webPageImageName.isEmpty {
            name = webPageImageName
        } else {
            name = webPageInfo.title
        }
        name?.truncateIfNeeded()

        productUrl = webPageInfo.url
        imageUrl = webPageImage?.url
        price = webPageInfo.price
    }
}

// MARK: - API

protocol WishApi: NetworkResource {
    
    static func createWish(_ wish: Wish, completionHandler: @escaping (Result<NetworkResponse<Wish>, NetworkError>) -> Void)
}

struct WishResource: WishApi {
    
    static var baseUrl: URL = URL(string: "\(AppConfig.backendUrl)/v1/wishes")!
    
    static func createWish(_ wish: Wish, completionHandler: @escaping (Result<NetworkResponse<Wish>, NetworkError>) -> Void) {
        
        let httpBody = try! JSONEncoder().encode(wish)
        Network.post(baseUrl, bodyData: httpBody, completionHandler: completionHandler)
    }
}
