//
//  SectionHeaderLabel.swift
//  Share
//
//  Created by Tim Fischer on 23.01.21.
//

import UIKit

class SectionHeaderLabel: UILabel {

    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */
    
    override func drawText(in rect: CGRect) {
        let insets = UIEdgeInsets(top: 0, left: 55.0, bottom: 0, right: 55.0)
        super.drawText(in: rect.inset(by: insets))
        font = UIFont(name: "Roboto-Regular", size: 15.0)
        textColor = UIColor(named: "textColor")
    }

}
