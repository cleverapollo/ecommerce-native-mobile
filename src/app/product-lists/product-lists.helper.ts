import { getTaBarPath, TabBarRoute } from "../tab-bar/tab-bar-routes";

export const productListPageUrl = (productListId: string) => `/${getTaBarPath(TabBarRoute.PRODUCT_LISTS, true)}/product-list/${productListId}`;