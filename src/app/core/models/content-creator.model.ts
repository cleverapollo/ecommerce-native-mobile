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