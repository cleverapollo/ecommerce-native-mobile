import { Component, Input } from "@angular/core";
import { UserDto, UserWishListDto } from "@core/models/user.model";

@Component({
    selector: 'app-owners-info',
    template: ''
})
export class OwnersInfoComponentFake {
    @Input() owners: Array<UserDto | UserWishListDto> = [];
    @Input() showOnlyInitials = false;
}