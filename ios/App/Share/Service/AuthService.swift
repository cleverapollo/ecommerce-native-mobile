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
    var keychainwrapper: KeychainWrapper = KeychainWrapper.init(serviceName: "cap_sec", accessGroup: "3LDV8B8SZ2.io.wantic.app")
    
    static let shared = AuthService()
    
    private init() {}
    
    func login(completionHandler: @escaping (Result<String, Error>) -> Void) {
        guard let email = keychainwrapper.string(forKey: "loginEmail"),
        let password = keychainwrapper.string(forKey: "loginPassword"),
        let url = URL(string: "https://rest-dev.wantic.io/v1/auth/login") else {
            completionHandler(.failure(NSError(domain: "app.wantic.io", code: 930, userInfo: nil)))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        do {
            request.httpBody = try JSONEncoder().encode(LoginRequest(username: email, password: password))
        } catch let error {
            print(error.localizedDescription)
        }
        
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
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
        var tokenExpired = false
        
        do {
            let jwt = try decode(jwt: encodedToken)
            tokenExpired = jwt.expired
        } catch let error {
            print(error.localizedDescription)
        }
        
        print("token: \(encodedToken)")
        return tokenExpired ? nil : encodedToken
    }
}
