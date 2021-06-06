//
//  ApiService.swift
//  App
//
//  Created by Tim Fischer on 15.05.21.
//

import Foundation

struct ApiService {
    
    static func createPostRequest(authToken: String, httpBody: Data, url: URL) -> URLRequest {
        var request = createRequest(authToken: authToken, url: url, httpMethod: "POST")
        request.httpBody = httpBody
        return request
    }
    
    static func createGetRequest(authToken: String, url: URL) -> URLRequest {
        return createRequest(authToken: authToken, url: url, httpMethod: "GET")
    }
    
    private static func createRequest(authToken: String, url: URL, httpMethod: String) -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = httpMethod
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("Bearer " + authToken, forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("platform=ios; osVersion=\(AppConfig.osVersion); appVersion=\(AppConfig.appVersion);", forHTTPHeaderField: "Wantic-Client-Info")
        return request
    }
    
}
