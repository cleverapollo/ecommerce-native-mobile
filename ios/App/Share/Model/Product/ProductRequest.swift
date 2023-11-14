//
//  Product.swift
//  App
//
//  Created by Alex on 14/11/2023.
//

import Foundation

struct Product: Codable {
    
    var name: String
    var note: String
    var productUrl: String
    var affiliateUrl: String
    var imageUrl: String
    var productListId: String
    var price: Price
    var coupon: Coupon
    
    init(name: String, note: String, productUrl: String, imageUrl: String, affiliateUrl: String, productListId: String, price: Price, coupon: Coupon) {
        self.name = name
        self.note = note
        self.productUrl = productUrl
        self.imageUrl = imageUrl
        self.affiliateUrl = affiliateUrl
        self.productListId = productListId
        self.price = price
        self.coupon = coupon
    }
    
}


//{
//    "name": "Sandwich Wrap",
//    "note": "Drug/chem diabetes mellitus w oth skin complications",
//    "price": {
//      "amount": 172.01,
//      "currency": "€"
//    },
//    "productUrl": "https://nytimes.com/magna/bibendum/imperdiet/nullam/orci/pede.xml?molestie=turpis&nibh=enim&in=blandit&lectus=mi&pellentesque=in&at=porttitor&nulla=pede&suspendisse=justo&potenti=eu&cras=massa&in=donec&purus=dapibus&eu=duis&magna=at&vulputate=velit&luctus=eu&cum=est&sociis=congue&natoque=elementum&penatibus=in&et=hac&magnis=habitasse&dis=platea&parturient=dictumst&montes=morbi&nascetur=vestibulum&ridiculus=velit&mus=id&vivamus=pretium&vestibulum=iaculis&sagittis=diam&sapien=erat&cum=fermentum&sociis=justo&natoque=nec&penatibus=condimentum&et=neque&magnis=sapien&dis=placerat&parturient=ante&montes=nulla&nascetur=justo&ridiculus=aliquam&mus=quis&etiam=turpis&vel=eget&augue=elit&vestibulum=sodales&rutrum=scelerisque&rutrum=mauris&neque=sit&aenean=amet&auctor=eros&gravida=suspendisse&sem=accumsan&praesent=tortor&id=quis&massa=turpis&id=sed&nisl=ante&venenatis=vivamus&lacinia=tortor&aenean=duis&sit=mattis&amet=egestas&justo=metus&morbi=aenean&ut=fermentum&odio=donec&cras=ut&mi=mauris&pede=eget&malesuada=massa&in=tempor&imperdiet=convallis&et=nulla&commodo=neque&vulputate=libero&justo=convallis&in=eget&blandit=eleifend",
//    "affiliateUrl": "http://behance.net/integer/ac/neque/duis/bibendum/morbi/non.html?ultrices=hendrerit&posuere=at&cubilia=vulputate&curae=vitae&nulla=nisl&dapibus=aenean&dolor=lectus&vel=pellentesque&est=eget&donec=nunc&odio=donec&justo=quis&sollicitudin=orci&ut=eget&suscipit=orci&a=vehicula&feugiat=condimentum&et=curabitur&eros=in&vestibulum=libero&ac=ut&est=massa&lacinia=volutpat&nisi=convallis&venenatis=morbi&tristique=odio&fusce=odio&congue=elementum&diam=eu&id=interdum&ornare=eu&imperdiet=tincidunt&sapien=in&urna=leo&pretium=maecenas",
//    "imageUrl": "http://dummyimage.com/216x100.png/cc0000/ffffff",
//    "coupon": {
//      "code": "59779-866",
//      "value": "10 %",
//      "expirationDate": "2500-05-27"
//    },
//    "productListId": "e5eb3adf-651f-4693-9c37-7b7503db1d74"
//}
