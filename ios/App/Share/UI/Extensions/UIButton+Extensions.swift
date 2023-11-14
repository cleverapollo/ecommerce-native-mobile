import UIKit

// MARK: Gradients

extension UIButton {
    
    func applyPrivatGradient() {
        
        self.applyGradient(colours: [Color.get(.gradientPrivatStart), Color.get(.gradientPrivatEnd)],
                      angle: 113.0)
    }
    
    func applyCreatorGradient() {
        
        self.applyGradient(colours: [Color.get(.gradientCreatorStart), Color.get(.gradientCreatorEnd)],
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
