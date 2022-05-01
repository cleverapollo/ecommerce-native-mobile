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
    
    mutating func truncateIfNeeded() {
        guard self.count > Constants.maxAllowedChars else { return }
        self = String(self.prefix(Constants.maxAllowedChars))
    }
}
