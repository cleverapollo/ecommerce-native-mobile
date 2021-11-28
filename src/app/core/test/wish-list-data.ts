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
            isReserved: false
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
            bought: false
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
            bought: false
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
            bought: true
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
        bought: false
      }
}

}