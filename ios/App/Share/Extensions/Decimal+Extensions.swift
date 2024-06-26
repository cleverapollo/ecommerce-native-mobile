import Foundation

extension Decimal {
    
    var formattedAmount: String {
        let formatter = NumberFormatter()
        formatter.generatesDecimalNumbers = true
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        let formattedAmount = formatter.string(from: self as NSDecimalNumber) ?? "0.00"
        return formattedAmount.replacingOccurrences(of: ".", with: ",")
    }
}
