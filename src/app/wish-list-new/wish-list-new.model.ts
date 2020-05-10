import { WishListMemberDto } from '../shared/models/wish-list.model';

export class WishListCreate {
    name: String
    date: Date
    partners: Array<String> 
    members: Array<WishListMemberDto>
    wishes: Array<any> = [];
}