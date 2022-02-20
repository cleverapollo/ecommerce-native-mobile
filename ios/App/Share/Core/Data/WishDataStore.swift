import Foundation

protocol WishDataStorable {
    
    var wish: Wish { get }
    
    func update(_ wish: Wish)
    func reset()
}

class WishDataStore: WishDataStorable {
    
    static let shared = WishDataStore()
    
    var wish: Wish
    
    private init() {
        
        wish = Wish()
    }
    
    public func update(_ wish: Wish) {
        
        self.wish = wish
    }

    public func reset() {
        
        wish = Wish()
    }
}
