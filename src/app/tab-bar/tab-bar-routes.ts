export enum TabBarRoute {
  HOME,
  PRODUCT_LISTS,
  CREATOR_SEARCH,
  FRIENDS_HOME,
  WISH_SEARCH,
  MENU
}

export const getTaBarPath = (tab: TabBarRoute, fullPath: boolean): string => {
  switch (tab) {
    case TabBarRoute.HOME:
      return fullPath ? 'secure/home' : 'home';
    case TabBarRoute.FRIENDS_HOME:
      return fullPath ? 'secure/friends-home' : 'friends-home';
    case TabBarRoute.WISH_SEARCH:
      return fullPath ? 'secure/wish-search' : 'wish-search';
    case TabBarRoute.MENU:
      return fullPath ? 'secure/menu' : 'menu';
    case TabBarRoute.PRODUCT_LISTS:
      return fullPath ? 'secure/product-lists' : 'product-lists';
    case TabBarRoute.CREATOR_SEARCH:
      return fullPath ? 'secure/creator-search' : 'creator-search';
    default:
      break;
  }
}
