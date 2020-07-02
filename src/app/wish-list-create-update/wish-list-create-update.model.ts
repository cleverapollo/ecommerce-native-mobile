export class WishListCreateOrUpdateRequest {
    name: string
    date: Date
    partner: WishListCreateOrUpdatePartnerRequest
}

export class WishListCreateRequest extends WishListCreateOrUpdateRequest {
}

export class WishListUpdateRequest extends WishListCreateOrUpdateRequest {
    id: Number
}

export class WishListCreateOrUpdatePartnerRequest {
    name: string;
    email: string;
}