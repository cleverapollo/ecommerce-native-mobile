//
//  Price.swift
//  Share
//
//  Created by Tim Fischer on 14.03.21.
//

import Foundation

struct Price: Codable {
    
    var amount: Decimal
    let currency: String
    
    init(amount: Decimal, currency: String = "€") {
        self.amount = amount
        self.currency = currency
    }
    
}
