//
//  AuthService.swift
//  Share
//
//  Created by Tim Fischer on 17.12.20.
//

import Foundation
import SwiftKeychainWrapper
import JWTDecode

struct AuthService {
    
    var authToken: String?
    var keychainwrapper: KeychainWrapper = KeychainWrapper.init(serviceName: "cap_sec", accessGroup: AppConfig.keychainAccessGroup)
    
    static let shared = AuthService()
    
    private init() {}
    
    func refreshToken(expiredAuthToken: String, completionHandler: @escaping (Result<String, Error>) -> Void) {
        guard let url = URL(string: "\(AppConfig.backendUrl)/v1/auth/refresh-token") else {
            completionHandler(.failure(NSError(domain: "app.wantic.io", code: 930, userInfo: nil)))
            return
        }
        
        var request = URLRequest(url: url)
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer " + expiredAuthToken, forHTTPHeaderField: "Authorization")
        
        let task = URLSession.shared.dataTask(with: request, completionHandler: { (data, response, error) in
            if let error = error {
                print(error.localizedDescription)
                completionHandler(.failure(error))
            } else if let response = response as? HTTPURLResponse {
                guard let data = data, response.statusCode == 200 else {
                    let error = NSError(domain: "app.wantic.io", code: 910, userInfo: [ "statusCode": response.statusCode ])
                    completionHandler(.failure(error))
                    return
                }
                do {
                    let loginResponse = try JSONDecoder().decode(LoginResponse.self, from: data)
                    keychainwrapper.set(loginResponse.token, forKey: "auth-token")
                    completionHandler(.success(loginResponse.token))
                } catch let error {
                    print(error.localizedDescription)
                    completionHandler(.failure(error))
                }
            } else {
                completionHandler(.failure(NSError(domain: "app.wantic.io", code: 920, userInfo: nil)))
            }
            
        })
        task.resume()
    }
    
    func getAuthToken() -> String? {
        guard let encodedToken = keychainwrapper.string(forKey: "auth-token")?.replacingOccurrences(of: "\"", with: "") else {
            return nil
        }
        return encodedToken
    }
    
    func decodeToken(encodedToken: String) -> JWT? {
        do {
            return try decode(jwt: encodedToken)
        } catch let error {
            print(error.localizedDescription)
            return nil
        }
    }
    
    func tokenExists() -> Bool {
        return keychainwrapper.string(forKey: "auth-token")?.replacingOccurrences(of: "\"", with: "") != nil
    }
    
    func isTokenExpired(encodedToken: String) -> Bool {
        var tokenExpired = true
        if let decodedToken = decodeToken(encodedToken: encodedToken) {
            tokenExpired = decodedToken.expired
        }
        return tokenExpired
    }
}
