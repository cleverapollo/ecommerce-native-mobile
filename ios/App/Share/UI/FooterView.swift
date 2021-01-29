//
//  FooterView.swift
//  Share
//
//  Created by Tim Fischer on 29.01.21.
//

import UIKit

class FooterView: UIView {
    
    override func draw(_ rect: CGRect) {
        super.draw(rect)
        addTopBorderToFooterView()
    }
    
    private func addTopBorderToFooterView() {
        let topBorder = CALayer()
        topBorder.frame = CGRect(x: 0.0, y: 0.0, width: frame.size.width, height: 2.0)
        topBorder.backgroundColor = UIColor(named: "borderColor")!.cgColor
        topBorder.shadowColor = UIColor(hex: "#0000001A")?.cgColor
        topBorder.shadowOffset = CGSize(width: frame.size.width, height: 1)
        layer.addSublayer(topBorder)
    }

}
