import { PriceDto, WishDto } from '@core/models/wish-list.model';

export class SearchResult {
    totalResultCount: number;
    items: Array<SearchResultItem>;
}
export class SearchResultItem {
    id?: number;
    asin: string;
    name: string;
    price: PriceDto;
    imageUrl: String;
    productUrl: string;

    constructor(asin: string, name: string, imageUrl: String, productUrl: string, price: PriceDto | number, id?: number) {
        this.asin = asin;
        this.name = name;
        this.imageUrl = imageUrl;
        this.productUrl = productUrl;
        this.id = id;

        if (price instanceof PriceDto) {
            this.price = price;
        } else if (typeof price === 'number') {
            const priceAmnout = price as number;
            const priceDto = new PriceDto();
            priceDto.amount = priceAmnout;
            priceDto.currency = '€';
            this.price = priceDto;
        }

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

export interface WebCrawlerResultItem {
    id: number;
    imageUrl: string;
    name: string;
    price: number;
    productUrl: string;
}