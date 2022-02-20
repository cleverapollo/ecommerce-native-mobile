import Foundation
import UIKit

enum Image: String {
    
    case fallbackWishImage
    
    static func get(_ image: Image) -> UIImage {
        UIImage(named: image.rawValue)!
    }
}
