import UIKit

// MARK: Gradients

extension UIButton {
    
    func applyGradient() {
        
        self.applyGradient(colours: [Color.get(.gradientStart), Color.get(.gradientEnd)],
                      angle: 113.0)
    }
    
    func applyGradient(colours: [UIColor], angle: CGFloat) {
        
        let cornerRadius = 20.0
        let gradient: CAGradientLayer = CAGradientLayer()
        gradient.frame = self.bounds
        gradient.colors = colours.map { $0.cgColor }
        gradient.calculatePoints(for: angle)
        
        let shape = CAShapeLayer()
        shape.path = UIBezierPath(roundedRect: self.bounds.insetBy(dx: 0, dy: 0), cornerRadius: cornerRadius).cgPath
        shape.cornerRadius = cornerRadius
        gradient.mask = shape
        
        self.layer.cornerRadius = cornerRadius
        self.layer.insertSublayer(gradient, at: 0)
    }
    
}
