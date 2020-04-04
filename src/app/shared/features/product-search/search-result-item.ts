import { WishDto } from '../../models/wish-list.model';

export class SearchResultItem {
    name: String;
    price: String;
    imageUrl: String;
    productUrl: string;

    assignToWishDto(wishDto: WishDto) {
        wishDto.name = this.name
        wishDto.price = this.price
        wishDto.imageUrl = this.imageUrl
        wishDto.productUrl = this.productUrl
    }
}