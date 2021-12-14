import { WishDto, WishListDto } from "@core/models/wish-list.model";
import { FriendWish, FriendWishList } from "@friends/friends-wish-list-overview/friends-wish-list-overview.model";

export class WishListTestData {

  // birthday

  static get wishBoschWasher(): WishDto {
    return {
      id: '1',
      wishListId: '1',
      name: 'BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min',
      price: {
        amount: 469.0,
        currency: 'EUR',
        displayString: '469,00 €'
      },
      productUrl: 'https://www.otto.de/p/bosch-waschmaschine-4-wan282a8-8-kg-1400-u-min-1214867044/#variationId=1243447578',
      imageUrl: 'https://i.otto.de/i/otto/2233c1d8-93ed-50da-8618-a1c6241c0254?$001PICT36$',
      isReserved: false,
      isFavorite: true
    }
  }

  static get dogBowl(): WishDto {
    return {
      id: '9919f188-b355-4db7-a5d8-84d46208f721',
      wishListId: '1',
      name: 'Juna – Sonnengelb',
      price: {
        amount: 68.00,
        currency: 'EUR',
        displayString: '68,00 €'
      },
      productUrl: 'https://www.4nooks.com/produkt/design-hundenapf-juna-sonnengelb-i/',
      imageUrl: 'https://www.4nooks.com/wp-content/uploads/2019/04/Design_Hundenapf_Juna_gelb_ia_au%C3%9Fen.jpg',
      isReserved: false,
      isFavorite: false
    }
  }

  static get bvbShirt(): WishDto {
    return {
      id: 'c16c0538-d268-4d0d-9cf4-2f4155bf76b0',
      wishListId: '1',
      name: 'BVB PREMATCH SHIRT',
      note: 'neon color',
      price: {
        amount: 68.00,
        currency: 'EUR',
        displayString: '68,00 €'
      },
      productUrl: 'https://shop.bvb.de/maenner/freizeit/shirts/6227/bvb-prematch-shirt-neon?c=402&number=21928725-3XL',
      imageUrl: 'https://shop.bvbcdn.de/media/image/ae/d0/4a/66775-6131ef473fcbd_600x600.jpg',
      isReserved: false,
      isFavorite: true
    }
  }

  static get towels(): WishDto {
    return {
      id: 'c16c0538-d268-4d0d-9cf4-2f4155bf76b0',
      wishListId: '1',
      name: 'Mikrofaser Handtücher',
      note: 'Farbe: gelb',
      price: {
        amount: 34.45,
        currency: 'EUR',
        displayString: '34,45 €'
      },
      productUrl: 'https://www.amazon.de/NirvanaShape%C2%AE-schnelltrocknend-Badehandt%C3%BCcher-Reisehandt%C3%BCcher-Sporthandt%C3%BCcher/dp/B07LB8TCP6?smid=A36IGZEA4FNLWL&pf_rd_r=AWAPQ0GRDR35HA3AC64Q&pf_rd_p=9c7276a8-466b-47b5-bf12-7fe213d89989&pd_rd_r=19d8f266-5a08-470c-8198-2e7e6aaca101&pd_rd_w=vSdRd&pd_rd_wg=l8EU1&ref_=pd_gw_unk',
      imageUrl: 'https://m.media-amazon.com/images/I/71F-j4zCCsL._AC_UX679_.jpg',
      isReserved: false,
      isFavorite: false
    }
  }

  static get sharedWishBoschWasher(): FriendWish {
    return {
      id: '1',
      wishListId: '1',
      name: 'BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min',
      price: {
        amount: 469.0,
        currency: 'EUR',
        displayString: '469,00 €'
      },
      productUrl: 'https://www.otto.de/p/bosch-waschmaschine-4-wan282a8-8-kg-1400-u-min-1214867044/#variationId=1243447578',
      imageUrl: 'https://i.otto.de/i/otto/2233c1d8-93ed-50da-8618-a1c6241c0254?$001PICT36$',
      reservedByFriend: false,
      bought: false,
      isFavorite: true
    }
  }

  static get dogBowlSharedWish(): FriendWish {
    return {
      id: '9919f188-b355-4db7-a5d8-84d46208f721',
      wishListId: '1',
      name: 'Juna – Sonnengelb',
      price: {
        amount: 68.00,
        currency: 'EUR',
        displayString: '68,00 €'
      },
      productUrl: 'https://www.4nooks.com/produkt/design-hundenapf-juna-sonnengelb-i/',
      imageUrl: 'https://www.4nooks.com/wp-content/uploads/2019/04/Design_Hundenapf_Juna_gelb_ia_au%C3%9Fen.jpg',
      reservedByFriend: false,
      bought: false,
      isFavorite: false
    }
  }

  static get bvbShirtSharedWish(): FriendWish {
    return {
      id: 'c16c0538-d268-4d0d-9cf4-2f4155bf76b0',
      wishListId: '1',
      name: 'BVB PREMATCH SHIRT',
      note: 'neon color',
      price: {
        amount: 68.00,
        currency: 'EUR',
        displayString: '68,00 €'
      },
      productUrl: 'https://shop.bvb.de/maenner/freizeit/shirts/6227/bvb-prematch-shirt-neon?c=402&number=21928725-3XL',
      imageUrl: 'https://shop.bvbcdn.de/media/image/ae/d0/4a/66775-6131ef473fcbd_600x600.jpg',
      reservedByFriend: false,
      bought: false,
      isFavorite: true
    }
  }

  static get towelsSharedWish(): FriendWish {
    return {
      id: 'c16c0538-d268-4d0d-9cf4-2f4155bf76b0',
      wishListId: '1',
      name: 'Mikrofaser Handtücher',
      note: 'Farbe: gelb',
      price: {
        amount: 34.45,
        currency: 'EUR',
        displayString: '34,45 €'
      },
      productUrl: 'https://www.amazon.de/NirvanaShape%C2%AE-schnelltrocknend-Badehandt%C3%BCcher-Reisehandt%C3%BCcher-Sporthandt%C3%BCcher/dp/B07LB8TCP6?smid=A36IGZEA4FNLWL&pf_rd_r=AWAPQ0GRDR35HA3AC64Q&pf_rd_p=9c7276a8-466b-47b5-bf12-7fe213d89989&pd_rd_r=19d8f266-5a08-470c-8198-2e7e6aaca101&pd_rd_w=vSdRd&pd_rd_wg=l8EU1&ref_=pd_gw_unk',
      imageUrl: 'https://m.media-amazon.com/images/I/71F-j4zCCsL._AC_UX679_.jpg',
      reservedByFriend: false,
      bought: false,
      isFavorite: false
    }
  }

  static get wishKindle(): WishDto {
    return {
      id: '2',
      wishListId: '2',
      name: 'Kindle',
      price: {
        amount: 79.99,
        currency: 'EUR',
        displayString: '79,99 €'
      },
      productUrl: 'https://www.amazon.de/dp/B07FQ4DJ7X/ref=cm_sw_em_r_mt_dp_QPJH7Y6A9D11BN99Q1VG',
      imageUrl: 'https://m.media-amazon.com/images/I/61mAMtdTUwL._AC_SX679_.jpg',
      isReserved: false,
      isFavorite: false
    }
  }

  static get sharedWishKindle(): FriendWish {
    return {
      id: '2',
      wishListId: '1',
      name: 'Kindle',
      price: {
        amount: 79.99,
        currency: 'EUR',
        displayString: '79,99 €'
      },
      productUrl: 'https://www.amazon.de/dp/B07FQ4DJ7X/ref=cm_sw_em_r_mt_dp_QPJH7Y6A9D11BN99Q1VG',
      imageUrl: 'https://m.media-amazon.com/images/I/61mAMtdTUwL._AC_SX679_.jpg',
      reservedByFriend: true,
      bought: false,
      isFavorite: false
    }
  }

  static get wishWallet(): WishDto {
    return {
      id: '3',
      wishListId: '2',
      name: 'Personalisiertes Portemonnaie',
      price: {
        amount: 31.14,
        currency: 'EUR',
        displayString: '31,14 €'
      },
      productUrl: 'https://www.etsy.com/de/listing/667282692/jahrestag-geschenk-fur?ref=hp_prn-1&pro=1',
      imageUrl: 'https://i.etsystatic.com/19311499/r/il/b4be61/1839533908/il_794xN.1839533908_lgk6.jpg',
      isReserved: false,
      isFavorite: false
    }
  }

  static get sharedWishWallet(): FriendWish {
    return {
      id: '3',
      wishListId: '1',
      name: 'Personalisiertes Portemonnaie',
      price: {
        amount: 31.14,
        currency: 'EUR',
        displayString: '31,14 €'
      },
      productUrl: 'https://www.etsy.com/de/listing/667282692/jahrestag-geschenk-fur?ref=hp_prn-1&pro=1',
      imageUrl: 'https://i.etsystatic.com/19311499/r/il/b4be61/1839533908/il_794xN.1839533908_lgk6.jpg',
      reservedByFriend: false,
      bought: true,
      isFavorite: false
    }
  }

  static get wishListBirthday(): WishListDto {
    return {
      id: '1',
      name: 'Geburtstag',
      date: new Date(),
      wishes: [
        this.wishBoschWasher
      ],
      creatorEmail: 'max@mustermann.de',
      owners: [],
      showReservedWishes: true
    }
  }

  static get sharedWishListBirthday(): FriendWishList {
    return {
      id: '1',
      name: 'Geburtstag',
      date: (new Date()).toDateString(),
      wishes: [
        this.sharedWishBoschWasher,
        this.sharedWishKindle,
        this.sharedWishWallet
      ],
      owners: [],
    }
  }

  // Wedding

  static get wishListWedding(): WishListDto {
    return {
      id: '2',
      name: 'Hochzeit',
      date: new Date(),
      wishes: [
        this.wishKindle,
        this.wishWallet
      ],
      creatorEmail: 'max@mustermann.de',
      owners: [],
      showReservedWishes: true
    }
  }

  static get sharedWishListWedding(): FriendWishList {
    return {
      id: '2',
      name: 'Hochzeit',
      date: (new Date()).toDateString(),
      wishes: [
        this.sharedWishBoschWasher,
        this.sharedWishKindle,
        this.sharedWishWallet
      ],
      owners: [],
    }
  }

  static get sharedWishVanityUnit(): FriendWish {
    return {
      id: '10',
      wishListId: '2',
      name: 'NYSJÖN Waschbeckenunterschrank',
      price: {
        amount: 29.0,
        currency: 'EUR',
        displayString: '29,00 €'
      },
      productUrl: 'https://www.ikea.com/de/de/p/nysjoen-waschbeckenunterschrank-2-tueren-weiss-50470814/',
      imageUrl: 'https://www.ikea.com/de/de/images/products/nysjoen-waschbeckenunterschrank-2-tueren-weiss__0971610_pe811409_s5.jpg?f=xl',
      reservedByFriend: false,
      bought: false,
      isFavorite: false
    }
  }

}