import { SearchResultItem } from '../shared/features/product-search/search-result-item';

export class AccountInfos {
    firstName: String
    email: String
    password: String
}

export class WishListInfos {
    name: String
    date: Date
    wishes: Array<SearchResultItem> = new Array();
}

export interface RegistrationForm {
    accountInfos: AccountInfos
    wishList: WishListInfos
    partners: Array<String>
}

export class RegistrationForm implements RegistrationForm {

    constructor() {
        this.accountInfos = new AccountInfos();
        this.wishList = new WishListInfos();
    }

}