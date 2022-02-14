import Foundation

// MARK: - Models

struct Wish: Codable {
    
    var id: UUID?
    var wishListId: UUID?
    var name: String?
    var price: Price
    var productUrl: String?
    var imageUrl: String?
    
    init() {
        self.price = Price(amount: 0.00)
    }
    
    mutating func addProductInfo(_ productInfo: ProductInfo) {
        
        name = productInfo.name
        productUrl = productInfo.productUrl
        imageUrl = productInfo.imageUrl
        price = productInfo.price
    }
    
    func isValid() -> Bool {
        guard let _ = self.wishListId,
              let _ = self.name,
              let _ = self.productUrl,
              let _ = self.imageUrl else {
            return false
        }
        return true
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
