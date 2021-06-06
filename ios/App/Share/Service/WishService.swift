//
//  WishService.swift
//  Share
//
//  Created by Tim Fischer on 15.01.21.
//

import Foundation

class WishService {
    
    static let shared = WishService()
    
    private init() {}
    
    func saveWish(_ wish: Wish, completionHandler: @escaping (Result<Wish, Error>) -> Void) {
        AuthService.shared.getAuthToken(completionHandler: {authToken in
            guard let authToken = authToken else {
                completionHandler(.failure(NSError(domain: "app.wantic.io", code: 900, userInfo: nil)))
                return
            }
            
            let url = URL(string: "\(AppConfig.backendUrl)/v1/wishes")!
            let httpBody = try! JSONEncoder().encode(wish)
            let request = ApiService.createPostRequest(authToken: authToken, httpBody: httpBody, url: url)
 
            let task = URLSession.shared.dataTask(with: request, completionHandler: { (data, response, error) in
                guard error == nil else {
                    print(error!.localizedDescription)
                    completionHandler(.failure(error!))
                    return
                }
                
                guard let response = response as? HTTPURLResponse else {
                    completionHandler(.failure(NSError(domain: "app.wantic.io", code: 920, userInfo: nil)))
                    return
                }
                
                guard let data = data, response.statusCode == HttpStatusCode.OK else {
                    let error = NSError(domain: "app.wantic.io", code: response.statusCode, userInfo: nil)
                    completionHandler(.failure(error))
                    return
                }
                
                do {
                    let wish = try JSONDecoder().decode(Wish.self, from: data)
                    completionHandler(.success(wish))
                } catch let error {
                    print(error.localizedDescription)
                    completionHandler(.failure(error))
                }
                
            })
            task.resume()
        })
    }
    
}
