//
//  Profile.swift
//  App
//
//  Created by Alex on 19/11/2023.
//

import Foundation

struct Profile: Codable {
    var firstName: String
    var lastName: String
    var creatorAccount: Creator?
}

struct Creator: Codable {
    var name: String
    var userName: String
}
