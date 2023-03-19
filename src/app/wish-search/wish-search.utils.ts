import { SearchResultItem, SearchResultItemMapper } from '@core/models/search-result-item';
import { WishDto, WishListDto } from '@core/models/wish-list.model';

export const isOverviewPage = (url: string): boolean => url === '/secure/wish-search';

export const createNavigationState = (item: SearchResultItem, wishList: WishListDto): { searchResult: WishDto } => {
    const searchResult = SearchResultItemMapper.map(item, new WishDto());
    if (wishList) {
        searchResult.wishListId = wishList.id;
    }
    return { searchResult }
}