import { PriceDto } from "./wish-list.model";

export interface ProductList {
    id?: string;
    name: string;
    products: Product[];
}

export interface Coupon {
    code: string;
    value: string;
    expirationDate: string;
}

export interface Product {
    id?: string;
    name: string;
    url: string;
    price: PriceDto;
    imageUrl: string;
    productUrl: string;
    productListId: string;
    note?: string;
    asin?: string;
    affiliateUrl?: string;
    coupon?: Coupon;
}

export interface SharedProductList {
    id?: string;
    name: string;
    products: Product[];
    creator: {
        userName: string;
        hasImage: boolean;
    }
}
