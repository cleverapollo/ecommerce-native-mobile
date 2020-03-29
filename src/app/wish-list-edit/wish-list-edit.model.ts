import { UserSearchResult } from '../shared/services/user-api.model';
import { MemberToInviteDto, WishListMemberDto } from '../shared/models/wish-list.model';

export class WishListEdit {
    name: String
    date: Date
    partners: Array<String> 
    members: Array<String>
    membersToInvite: Array<MemberToInvite>
}

export class MemberToInvite {
    name: String;
    email: String;

    constructor(name: String, email: String) {
        this.name = name;
        this.email = email;
    }
}

export class InivtedMemberDisplayInfo {
    
    id: String;
    text: String;
    subText: String = null;
    imageUrl: String = null;

    static forUserSearchResult(result: UserSearchResult) : InivtedMemberDisplayInfo {
        const model = new InivtedMemberDisplayInfo();
        model.id = result.email ? result.email : null;
        model.text = result.firstName;
        model.imageUrl = result.imageUrl;
        return model;
    }

    static forMember(member: WishListMemberDto) : InivtedMemberDisplayInfo {
        const model = new InivtedMemberDisplayInfo();
        model.id = member.email ? member.email : member.preactiveUserId;
        model.text = member.name;
        model.imageUrl = null;
        model.subText = 'eingeladen';
        return model;
    }

    static forMemberToInvite(member: MemberToInviteDto) : InivtedMemberDisplayInfo {
        const model = new InivtedMemberDisplayInfo();
        model.id = member.email;
        model.text = member.name;
        model.imageUrl = null;
        model.subText = 'Einladung ausstehend';
        return model;
    }

}