export class WishListCreateOrUpdateRequest {
    name: string
    date: Date
    partner: InvitePartnerRequest
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

export class InvitePartnerRequest {
    name: string;
    email: string;
}