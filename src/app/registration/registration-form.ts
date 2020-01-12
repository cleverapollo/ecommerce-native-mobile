import { SearchResultItem } from './services/search-result-item';

export interface RegistrationForm {
    name: String;
    date: Date;
    partner: String;
    wishes: [SearchResultItem];
    accountInfos: {
        firstName: String;
        credentials: {
            email: String;
            password: String;
        }
    }
}