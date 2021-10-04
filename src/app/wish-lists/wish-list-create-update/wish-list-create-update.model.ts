export class WishListCreateOrUpdateRequest {
    name: string;
    date?: Date;
    showReservedWishes: boolean;
}

export class WishListCreateRequest extends WishListCreateOrUpdateRequest {

}

export class WishListUpdateRequest extends WishListCreateOrUpdateRequest {
    id: string
}

export class InvitePartnerRequest {
    name: string;
    email: string;
}