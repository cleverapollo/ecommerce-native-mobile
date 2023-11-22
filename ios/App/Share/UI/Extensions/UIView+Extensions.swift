import UIKit

// MARK: - Auto Layout

extension UIView {
    
    func setupAutoLayout(forSubview: UIView) {
        
        let insets: NSDirectionalEdgeInsets = .zero
        let constraints: [NSLayoutConstraint] = [
            forSubview.leadingAnchor.constraint(equalTo: leadingAnchor,
                                     constant: insets.leading),

            forSubview.trailingAnchor.constraint(equalTo: trailingAnchor,
                                      constant: -insets.trailing),

            forSubview.topAnchor.constraint(equalTo: topAnchor,
                                 constant: insets.top),

            forSubview.bottomAnchor.constraint(equalTo: bottomAnchor,
                                    constant: -insets.bottom)
        ]
        
        translatesAutoresizingMaskIntoConstraints = false

        addSubview(forSubview)
        
        NSLayoutConstraint.activate(constraints)
    }
}

// MARK: IBDesignables

@IBDesignable
class DesignableTextView: UITextView {
}

@IBDesignable
class DesignableImageView: UIImageView {
}

@IBDesignable
class DesignableTextField: UITextField {
    // Provides left padding for images
    override func leftViewRect(forBounds bounds: CGRect) -> CGRect {
        var textRect = super.leftViewRect(forBounds: bounds)
        textRect.origin.x += leftPadding
        return textRect
    }
    
    @IBInspectable var leftImage: UIImage? {
        didSet {
            updateView()
        }
    }
    
    @IBInspectable var leftPadding: CGFloat = 0
    
    @IBInspectable var color: UIColor = UIColor.lightGray {
        didSet {
            updateView()
        }
    }
    
    func updateView() {
        if let image = leftImage {
            leftViewMode = UITextField.ViewMode.always
            let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 20, height: 20))
            imageView.contentMode = .scaleAspectFit
            imageView.image = image
            // Note: In order for your image to use the tint color, you have to select the image in the Assets.xcassets and change the "Render As" property to "Template Image".
            imageView.tintColor = color
            leftView = imageView
        } else {
            leftViewMode = UITextField.ViewMode.never
            leftView = nil
        }
        
        // Placeholder text color
        attributedPlaceholder = NSAttributedString(string: placeholder != nil ?  placeholder! : "", attributes:[NSAttributedString.Key.foregroundColor: color])
    }
}

extension UIView {
    
    @IBInspectable
    var cornerRadius: CGFloat {
        get {
            return layer.cornerRadius
        }
        set {
            layer.cornerRadius = newValue
        }
    }

    @IBInspectable
    var borderWidth: CGFloat {
        get {
            return layer.borderWidth
        }
        set {
            layer.borderWidth = newValue
        }
    }
    
    @IBInspectable
    var borderColor: UIColor? {
        get {
            if let color = layer.borderColor {
                return UIColor(cgColor: color)
            }
            return nil
        }
        set {
            if let color = newValue {
                layer.borderColor = color.cgColor
            } else {
                layer.borderColor = nil
            }
        }
    }
    
    @IBInspectable
    var shadowRadius: CGFloat {
        get {
            return layer.shadowRadius
        }
        set {
            layer.shadowRadius = newValue
        }
    }
    
    @IBInspectable
    var shadowOpacity: Float {
        get {
            return layer.shadowOpacity
        }
        set {
            layer.shadowOpacity = newValue
        }
    }
    
    @IBInspectable
    var shadowOffset: CGSize {
        get {
            return layer.shadowOffset
        }
        set {
            layer.shadowOffset = newValue
        }
    }
    
    @IBInspectable
    var shadowColor: UIColor? {
        get {
            if let color = layer.shadowColor {
                return UIColor(cgColor: color)
            }
            return nil
        }
        set {
            if let color = newValue {
                layer.shadowColor = color.cgColor
            } else {
                layer.shadowColor = nil
            }
        }
    }
    
    enum ViewSide {
        case Left, Right, Top, Bottom
    }
    
    func addBorder(toSide side: ViewSide, withColor color: CGColor, andThickness thickness: CGFloat) {
        
        let border = CALayer()
        border.backgroundColor = color
        
        switch side {
        case .Left: border.frame = CGRect(x: frame.minX, y: frame.minY, width: thickness, height: frame.height); break
        case .Right: border.frame = CGRect(x: frame.maxX, y: frame.minY, width: thickness, height: frame.height); break
        case .Top: border.frame = CGRect(x: frame.minX, y: frame.minY, width: frame.width, height: thickness); break
        case .Bottom: border.frame = CGRect(x: frame.minX, y: frame.maxY, width: frame.width, height: thickness); break
        }
        
        layer.addSublayer(border)
    }
    
    func applyOrangeGradient() {
        
        self.applyGradient(colours: [Color.get(.gradientOrangeStart), Color.get(.gradientOrangeEnd)],
                      angle: 113.0)
    }
    
    func applyPurpleGradient() {

        self.applyGradient(colours: [Color.get(.gradientPurpleStart), Color.get(.gradientPurpleEnd)],
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
        print(self.layer.sublayers?.count ?? 100)
    }
}
