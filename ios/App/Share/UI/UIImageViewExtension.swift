//
//  UIImageViewExtension.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit
import SVGKit

extension UIImageView{

     func setImageFromURl(imageUrlString: String){
         if let url = NSURL(string: imageUrlString) {
             if let imagedata = NSData(contentsOf: url as URL) {
                if imageUrlString.contains(".svg") {
                    self.image = SVGKImage(data: imagedata as Data)?.uiImage
                } else {
                    self.image = UIImage(data: imagedata as Data)
                }
             }
         }
     }
 }
