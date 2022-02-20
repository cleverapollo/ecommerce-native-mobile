import Foundation

struct WebPageImage: Equatable, CustomStringConvertible {
    
    let id: Int
    let name: String
    let url: String
    
    var description: String {
        "\(id): \(name) - \(url)"
    }
    
    init(dictionary: [String: Any]) {
        self.id = dictionary["id"] as? Int ?? -1
        self.name = dictionary["name"] as? String ?? ""
        self.url = dictionary["url"] as? String ?? ""
    }
    
    static func == (lhs: WebPageImage, rhs: WebPageImage) -> Bool {
        
        lhs.id == rhs.id
    }
    
}
