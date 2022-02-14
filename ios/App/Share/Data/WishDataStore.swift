import Foundation

protocol WishDataStorable {
    
    var wish: Wish { get }
    
    func reset()
}

class WishDataStore: WishDataStorable {
    
    static let shared = WishDataStore()
    
    var wish: Wish
    
    private init() {
        
        wish = Wish()
    }

    public func reset() {
        
        wish = Wish()
    }
}
