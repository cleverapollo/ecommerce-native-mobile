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
                if imageUrlString.contains(".svg"), let uiImage = SVGKImage(data: imagedata as Data)?.uiImage  {
                    self.image = uiImage
                } else if let uiImage = UIImage(data: imagedata as Data)  {
                    self.image = uiImage
                } else {
                    print("Can't create UIImage! URL is " + imageUrlString)
                }
             } else {
                print("Can't create image data from URL! URL is " + imageUrlString)
             }
         } else {
            print("Can't create URL from String! URL is " + imageUrlString)
         }
     }
 }
