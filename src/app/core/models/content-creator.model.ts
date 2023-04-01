export interface ContentCreatorAccount {
    name: string;
    userName: string;
    description: string;
    socialMediaLinks: SocialMediaLinks
}

export interface SocialMediaLinks {
    instagramUrl?: string;
    facebookUrl?: string;
    youtubeUrl?: string;
    tiktokUrl?: string;
}