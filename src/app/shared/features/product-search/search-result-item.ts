import { WishDto } from '../../models/wish-list.model';

export class SearchResultItem {
    name: String;
    price: String;
    imageUrl: String;
    productUrl: string;
}

export class SearchResultItemMapper {
    static map(from: SearchResultItem, to: WishDto) : WishDto  {
        to.name = from.name
        to.price = parseFloat(String(from.price))
        to.imageUrl = from.imageUrl
        to.productUrl = from.productUrl
        return to
    }
}