export interface ProductList {
    id?: string;
    name: string;
    products: Product[];
}

export interface Product {
    name: string;
    url: string;
    imageUrl: string;
}

export interface SharedProductList {
    id?: string;
    name: string;
    products: any[];
    creator: {
        name: string;
        hasImage: boolean;
    }
}
