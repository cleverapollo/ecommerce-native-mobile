//
//  WishDataStore.swift
//  Share
//
//  Created by Tim Fischer on 15.01.21.
//

import Foundation

class WishDataStore {
    
    static let shared = WishDataStore()
    private init() {}

    var wish = Wish()
    
    public func reset() {
        wish = Wish()
    }
    
}
