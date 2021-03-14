import { PriceDto, WishDto } from '@core/models/wish-list.model';

export class SearchResult {
    totalResultCount: number;
    items: Array<SearchResultItem>;
}
export class SearchResultItem {
    name: String;
    price: PriceDto;
    imageUrl: String;
    productUrl: string;

    constructor(name: String, imageUrl: String, productUrl: string, price: PriceDto) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.productUrl = productUrl;
        this.price = price;
    }
}

export class SearchResultItemMapper {
    static map(from: SearchResultItem, to: WishDto) : WishDto  {
        to.name = from.name
        to.price = from.price
        to.imageUrl = from.imageUrl
        to.productUrl = from.productUrl
        return to
    }
}