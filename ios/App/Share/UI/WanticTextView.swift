//
//  WanticTextView.swift
//  Share
//
//  Created by Tim Fischer on 29.01.21.
//

import UIKit

class WanticTextView: DesignableTextView {

    let padding = UIEdgeInsets(top: 16, left: 20, bottom: 16, right: 20)
    
    override func draw(_ rect: CGRect) {
        super.draw(rect)
        textContainerInset = padding
    }

}
