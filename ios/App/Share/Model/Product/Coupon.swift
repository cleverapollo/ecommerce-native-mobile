//
//  coupon.swift
//  App
//
//  Created by Alex on 14/11/2023.
//

import Foundation

struct Coupon: Codable {
    
    var code: String
    var value: String
    var expirationDate: String
    
    init(code: String, value: String, expirationDate: String) {
        self.code = code
        self.value = value
        self.expirationDate = expirationDate
    }
    
}
