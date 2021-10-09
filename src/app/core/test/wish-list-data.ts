import { WishDto, WishListDto } from "@core/models/wish-list.model";

export class WishListTestData {

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

}