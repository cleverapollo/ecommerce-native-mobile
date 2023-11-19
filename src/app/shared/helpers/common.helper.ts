import { FriendWishList } from "@core/models/wish-list.model";

// Immediately Invoked Function Expression
export const iife = (func: Promise<void>): void => {
    (async () => {
        await func;
    })();
}

export const findSharedWishList = (id: string, lists: FriendWishList[]): FriendWishList => {
    return lists.find((w) => w.id === id);
}

export const isAppPath = (url: string): boolean => {
    return url.indexOf('/secure/') !== -1;
}