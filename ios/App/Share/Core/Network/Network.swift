import Foundation

protocol NetworkResponsable {
    
    associatedtype T
    
    var data : T { get }
}

struct NetworkResponse<T>: NetworkResponsable {

    var data : T
}

protocol Networkable {
    
    associatedtype T
    
    static func post(_ url: URL, bodyData: Data, completionHandler: @escaping (Result<NetworkResponse<T>, NetworkError>) -> Void)
    static func get(_ url: URL, completionHandler: @escaping (Result<NetworkResponse<T>, NetworkError>) -> Void)
}


enum HttpMethod: String {
    
    case GET
    case POST
}

protocol NetworkResource {
    
    static var baseUrl: URL { get }
}

enum HttpStatusCode: Int {
    
    case ok = 200
    case created = 201
    case noContent = 204
    case badRequest = 400
    case unauthorized = 401
    case notFound = 404
    case internalServerError = 500
    case serviceUnavailable = 503
}

// MARK: Network Errors

enum NetworkError: Error {
    
    case unauthorized
    case general
    case unexpected(code: Int)
}

// MARK: Network service

struct Network<T: Decodable>: Networkable {
    
    static func post(_ url: URL, bodyData: Data, completionHandler: @escaping (Result<NetworkResponse<T>, NetworkError>) -> Void) {
        
        AuthService.shared.getAuthToken() { idToken in
            
            guard let authToken = idToken else {
                completionHandler(.failure(.unauthorized))
                return
            }

            var request = createRequest(authToken: authToken, url: url, httpMethod: .POST)
            request.httpBody = bodyData

            let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
                handleDataTaskResponse(data, response, error, completionHandler: completionHandler)
            }
            task.resume()
        }
    }
    
    static func get(_ url: URL, completionHandler: @escaping (Result<NetworkResponse<T>, NetworkError>) -> Void) {
        
        AuthService.shared.getAuthToken() { idToken in
            
            guard let idToken = idToken else {
                completionHandler(.failure(.unauthorized))
                return
            }
            
            let request = createRequest(authToken: idToken, url: url, httpMethod: .GET)
            
            let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
                handleDataTaskResponse(data, response, error, completionHandler: completionHandler)
            }
            task.resume()
        }
    }
    
    private static func createRequest(authToken: String, url: URL, httpMethod: HttpMethod) -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = httpMethod.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("Bearer " + authToken, forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("platform=ios; osVersion=\(AppConfig.osVersion); appVersion=\(AppConfig.appVersion);", forHTTPHeaderField: "Wantic-Client-Info")
        return request
    }
    
    private static func handleDataTaskResponse(_ data: Data?, _ response: URLResponse?, _ error: Error?, completionHandler: @escaping (Result<NetworkResponse<T>, NetworkError>) -> Void) {
        
        guard error == nil, let data = data, let response = response as? HTTPURLResponse else {
            completionHandler(.failure(.general))
            return
        }
        
        guard let statusCode = HttpStatusCode(rawValue: response.statusCode), statusCode == .ok || statusCode == .created   else {
            completionHandler(.failure(.unexpected(code: response.statusCode)))
            return
        }
        decodeData(data, completionHandler)
    }
    
    private static func decodeData(_ data: Data, _ completionHandler: (Result<NetworkResponse<T>, NetworkError>) -> Void) {
        do {
            let decodedData = try JSONDecoder().decode(T.self, from: data)
            completionHandler(.success(NetworkResponse(data: decodedData)))
        } catch _ {
            completionHandler(.failure(.general))
        }
    }
    
}
