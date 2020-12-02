export enum TabBarRoute {
    HOME,
    FRIENDS_HOME,
    WISH_SEARCH,
    MENU
  }
  
  export function getTaBarPath(tab: TabBarRoute, fullPath: boolean): string {
    switch (tab) {
      case TabBarRoute.HOME:
        return fullPath ? 'secure/home' : 'home';
      case TabBarRoute.FRIENDS_HOME:
        return fullPath ? 'secure/friends-home' :'friends-home';
      case TabBarRoute.WISH_SEARCH:
        return fullPath ? 'secure/wish-search' :'wish-search';
      case TabBarRoute.MENU:
        return fullPath ? 'secure/menu' :'menu';
      default:
        break;
    }
  }
  