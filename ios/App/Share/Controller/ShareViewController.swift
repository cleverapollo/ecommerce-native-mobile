//
//  ShareViewController.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit

class ShareViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.addBlurEffect()
    }
    
    private func addBlurEffect() {
        if UIAccessibility.isReduceTransparencyEnabled == false {
            view.backgroundColor = .clear

            let blurEffect = UIBlurEffect(style: .dark)
            let blurEffectView = UIVisualEffectView(effect: blurEffect)
            //always fill the view
            blurEffectView.frame = self.view.bounds
            blurEffectView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

            view.insertSubview(blurEffectView, at: 0)
        } else {
            view.backgroundColor = .black
        }
    }
    

    
}
