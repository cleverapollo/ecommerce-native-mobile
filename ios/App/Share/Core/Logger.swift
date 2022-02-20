import Foundation

protocol Logging {
    
    static func info(_ items: Any...)
    static func warn(_ items: Any...)
    static func debug(_ items: Any...)
    static func error(_ items: Any...)
    static func success(_ items: Any...)
}

enum LogLevel {
    
    case info
    case error
    case warn
    case debug
    case success
    
    public var emoji: String {
        
        switch self {
        case .info:
            return "ℹ️"
        case .warn:
            return "⚠️"
        case .error:
            return "🔴"
        case .debug:
            return "🐞"
        case .success:
            return "🟢"
        }
    }
}

struct Logger: Logging {

    private static var dateFormatter: DateFormatter {
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "HH:mm:ss"
        return dateFormatter
    }
    
    private init() {}
    
    static func warn(_ items: Any...) {
        
        log(items, logLevel: .warn)
    }
    
    static func info(_ items: Any...) {
        
        log(items, logLevel: .info)
    }
    
    static func debug(_ items: Any...) {
        
        log(items, logLevel: .debug)
    }
    
    static func error(_ items: Any...) {
        
        log(items, logLevel: .error)
    }
    
    static func success(_ items: Any...) {
        
        log(items, logLevel: .success)
    }
    
    private static func log(_ items: Any..., logLevel: LogLevel) {
        
        print("\(logLevel.emoji)  \(Logger.dateFormatter.string(from: Date()))", items)
    }
}
