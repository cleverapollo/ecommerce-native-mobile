//
//  String+Decimal.swift
//  App
//
//  Created by Tim Fischer on 02.11.21.
//

import Foundation

extension String {
    static let numberFormatter = NumberFormatter()
    var decimalValue: Decimal {
        String.numberFormatter.decimalSeparator = "."
        if let result =  String.numberFormatter.number(from: self) {
            return result.decimalValue
        } else {
            String.numberFormatter.decimalSeparator = ","
            if let result = String.numberFormatter.number(from: self) {
                return result.decimalValue
            }
        }
        return 0.00
    }
}
