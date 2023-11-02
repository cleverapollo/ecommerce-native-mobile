import { ProductList } from "./product-list.model";

export interface NewCreator {
    name: string;
    userName: string;
    description: string;
    socialMediaLinks: SocialMediaLinks;
}

export interface ContentCreatorAccount {
    name: string;
    userName: string;
    description: string;
    socialMediaLinks: SocialMediaLinks;
    productLists: ProductList[];
    hasImage: boolean;
}

export interface SocialMediaLinks {
    instagramUrl?: string;
    facebookUrl?: string;
    youtubeUrl?: string;
    tiktokUrl?: string;
}

export enum SocialMedia {
    Instagram = 'instagram',
    Facebook = 'facebook',
    YouTube = 'youtube',
    TikTok = 'tiktok'
}