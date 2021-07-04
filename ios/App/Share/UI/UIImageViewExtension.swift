//
//  UIImageViewExtension.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit
import SVGKit

extension UIImageView {
    
    static let minSizeHeight: CGFloat = 10.0
    static let minSizeWidth: CGFloat = 10.0

     func setImageFromURl(imageUrlString: String) -> Bool {
         if let url = NSURL(string: imageUrlString) {
             if let imagedata = NSData(contentsOf: url as URL) {
                if imageUrlString.contains(".svg"), let uiImage = SVGKImage(data: imagedata as Data)?.uiImage, uiImage.size.height > UIImageView.minSizeHeight && uiImage.size.width > UIImageView.minSizeWidth  {
                    self.image = uiImage.scalePreservingAspectRatio(targetSize: frame.size)
                    print("Load UIImage with URL is " + imageUrlString)
                    return true
                } else if let uiImage = UIImage(data: imagedata as Data), uiImage.size.height > UIImageView.minSizeHeight && uiImage.size.width > UIImageView.minSizeWidth {
                    print("Load UIImage with URL is " + imageUrlString)
                    self.image = uiImage.scalePreservingAspectRatio(targetSize: frame.size)
                    return true
                } else {
                    print("Can't create UIImage! URL is " + imageUrlString)
                }
             } else {
                print("Can't create image data from URL! URL is " + imageUrlString)
             }
         } else {
            print("Can't create URL from String! URL is " + imageUrlString)
         }
        return false
     }
 }
