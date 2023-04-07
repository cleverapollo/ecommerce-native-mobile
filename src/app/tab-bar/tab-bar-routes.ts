export enum TabBarRoute {
  HOME,
  PRODUCT_LIST_OVERVIEW,
  CREATOR_SEARCH,
  FRIENDS_HOME,
  WISH_SEARCH,
  MENU
}

export function getTaBarPath(tab: TabBarRoute, fullPath: boolean): string {
  switch (tab) {
    case TabBarRoute.HOME:
      return fullPath ? 'secure/home' : 'home';
    case TabBarRoute.FRIENDS_HOME:
      return fullPath ? 'secure/friends-home' : 'friends-home';
    case TabBarRoute.WISH_SEARCH:
      return fullPath ? 'secure/wish-search' : 'wish-search';
    case TabBarRoute.MENU:
      return fullPath ? 'secure/menu' : 'menu';
    case TabBarRoute.PRODUCT_LIST_OVERVIEW:
      return fullPath ? 'secure/product-list-overview' : 'product-list-overview';
    case TabBarRoute.CREATOR_SEARCH:
      return fullPath ? 'secure/creator-search' : 'creator-search';
    default:
      break;
  }
}
