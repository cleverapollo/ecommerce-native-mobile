//
//  UIImageViewExtension.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit

extension UIImageView{

     func setImageFromURl(ImageUrl: String){

         if let url = NSURL(string: ImageUrl) {
             if let imagedata = NSData(contentsOf: url as URL) {
                 self.image = UIImage(data: imagedata as Data)
             }
         }
     }
 }
