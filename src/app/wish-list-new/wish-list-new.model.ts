export class WishListCreateRequest {
    name: string
    date: Date
    partner: WishListCreatePartnerRequest
}

export class WishListCreatePartnerRequest {
    name: string;
    email: string;
}