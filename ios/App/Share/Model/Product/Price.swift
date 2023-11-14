import Foundation

struct Price: Codable {
    
    var amount: Decimal
    let currency: String
    
    init(amount: Decimal, currency: String = "€") {
        self.amount = amount
        self.currency = currency
    }
    
}
