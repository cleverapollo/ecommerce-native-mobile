//
//  WanticShareNavigationController.swift
//  App
//
//  Created by Tim Fischer on 05.05.21.
//

import UIKit

class WanticShareNavigationController: UINavigationController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if #available(iOSApplicationExtension 13.0, *) {
            let appearance = UINavigationBarAppearance()
            appearance.configureWithOpaqueBackground()
            appearance.backgroundColor = .white
            navigationBar.standardAppearance = appearance;
            navigationBar.scrollEdgeAppearance = navigationBar.standardAppearance
        }
    }
}
