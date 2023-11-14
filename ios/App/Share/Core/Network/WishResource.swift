import Foundation

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
