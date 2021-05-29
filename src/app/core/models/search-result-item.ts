import { PriceDto, WishDto } from '@core/models/wish-list.model';

export class SearchResult {
    totalResultCount: number;
    items: Array<SearchResultItem>;
}
export class SearchResultItem {
    asin: string;
    name: String;
    price: PriceDto;
    imageUrl: String;
    productUrl: string;

    constructor(asin: string, name: String, imageUrl: String, productUrl: string, price: PriceDto) {
        this.asin = asin;
        this.name = name;
        this.imageUrl = imageUrl;
        this.productUrl = productUrl;
        this.price = price;
    }
}

export class SearchResultItemMapper {
    static map(from: SearchResultItem, to: WishDto) : WishDto  {
        to.asin = from.asin;
        to.name = from.name
        to.price = from.price
        to.imageUrl = from.imageUrl
        to.productUrl = from.productUrl
        return to
    }
}