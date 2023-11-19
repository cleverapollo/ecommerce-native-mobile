//
//  UIAlertController+Extension.swift
//  App
//
//  Created by Alex on 19/11/2023.
//

import UIKit

extension UIAlertController {
    func addDatePicker(mode: UIDatePicker.Mode, date: Date?, minimumDate: Date? = nil, maximumDate: Date? = nil, action: DatePickerViewController.Action?) {
        let datePicker = DatePickerViewController(mode: mode, date: date, minimumDate: minimumDate, maximumDate: maximumDate, action: action)
        
        datePicker.preferredContentSize.height = 247
        setValue(datePicker, forKey: "contentViewController")
    }
}
