import { Share, ShareResult } from "@capacitor/share";

export const shareLink = (link: string, title: string, message?: string): Promise<ShareResult> => Share.share({
    title: title,
    text: message,
    url: link
});