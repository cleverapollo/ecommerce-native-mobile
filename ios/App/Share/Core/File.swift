import Foundation

enum FileType: String {
    
    case javaScript = "js"
}

enum File: String {
    
    case webCrawler
    
    var type: FileType {
        switch self {
        case .webCrawler:
            return .javaScript
        }
    }
 
    static func getFileContent(_ file: File) -> String? {
        
        if let filePath = Bundle.main.path(forResource: file.rawValue, ofType: file.type.rawValue) {
            do {
                return try String(contentsOfFile: filePath)
            } catch {
                return nil
            }
        }
        return nil
    }
    
}
