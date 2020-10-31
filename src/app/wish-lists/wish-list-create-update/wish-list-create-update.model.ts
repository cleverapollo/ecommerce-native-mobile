export class WishListCreateOrUpdateRequest {
    name: string
    date: Date
    partner: WishListCreateOrUpdatePartnerRequest
}

export class WishListCreateRequest extends WishListCreateOrUpdateRequest {
    constructor(name?: string) {
        super();
        this.name = name
    }
}

export class WishListUpdateRequest extends WishListCreateOrUpdateRequest {
    id: Number
}

export class WishListCreateOrUpdatePartnerRequest {
    name: string;
    email: string;
}