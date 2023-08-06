import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FriendWish, WishDto } from "@core/models/wish-list.model";
import { WishShopInfoComponentStyles } from "@shared/components/wish-shop-info/wish-shop-info.component";

@Component({
    selector: 'app-wish-shop-info',
    template: ''
})
export class WishShopInfoComponentFake {

    @Input() wish: WishDto | FriendWish;
    @Input() styles: WishShopInfoComponentStyles;
    @Input() toggleIsFavorite = false;

    @Output() wishUpdate = new EventEmitter<boolean>();
}