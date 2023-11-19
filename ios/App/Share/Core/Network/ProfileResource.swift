//
//  ProfileResource.swift
//  App
//
//  Created by Alex on 19/11/2023.
//

import Foundation

// MARK: - API

protocol ProfileApi: NetworkResource {
    
    static func getProfile(completionHandler: @escaping (Result<NetworkResponse<Profile>, NetworkError>) -> Void)
}

struct ProfileResource: ProfileApi {
    static var baseUrl = URL(string: "\(AppConfig.backendUrl)/v1/users/profile")!

    static func getProfile(completionHandler: @escaping (Result<NetworkResponse<Profile>, NetworkError>) -> Void)  {
        
        Network<Profile>.get(baseUrl) { result in
            switch result {
            case .success(let response):
                completionHandler(.success(NetworkResponse(data: response.data)))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }
}

