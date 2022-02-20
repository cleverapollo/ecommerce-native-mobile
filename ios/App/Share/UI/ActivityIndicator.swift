import UIKit

struct ActivityIndicator {
    
    private static let height: CGFloat = 50.0
    
    private init() {}

    static func create(_ text: String, for vcView: UIView) -> UIVisualEffectView {
        let width = vcView.frame.width - 20

        let label = setupLabel(text: text, width: width)
        let activityIndicator = setupActivityIndicatorView()
        
        let x = vcView.frame.midX - label.frame.width / 2
        let y = vcView.frame.midY - label.frame.height / 2
        
        let visualEffectView = setupVisualEffectView(x: x, y: y, width: width)
        visualEffectView.contentView.addSubview(activityIndicator)
        visualEffectView.contentView.addSubview(label)
        return visualEffectView
    }
    
    private static func setupVisualEffectView(x: CGFloat, y: CGFloat, width: CGFloat) -> UIVisualEffectView {
        
        let visualEffectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
        visualEffectView.frame = CGRect(x: x, y: y , width: width, height: ActivityIndicator.height)
        visualEffectView.layer.cornerRadius = 15
        visualEffectView.layer.masksToBounds = true
        return visualEffectView
    }
    
    private static func setupLabel(text: String, width: CGFloat) -> UILabel {
        
        let label = UILabel(frame: CGRect(x: 50, y: 0, width: width, height: ActivityIndicator.height))
        label.text = text
        label.numberOfLines = 0
        label.font = .systemFont(ofSize: 14, weight: .medium)
        label.textColor = UIColor(white: 0.9, alpha: 0.7)
        return label
    }
    
    private static func setupActivityIndicatorView() -> UIActivityIndicatorView {
        
        let width = ActivityIndicator.height
        let activityIndicator = UIActivityIndicatorView(style: .white)
        activityIndicator.frame = CGRect(x: 0, y: 0, width: width, height: ActivityIndicator.height)
        activityIndicator.startAnimating()
        return activityIndicator
    }
    
}
