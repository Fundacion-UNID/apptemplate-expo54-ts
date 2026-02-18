import { parseOfferEntitlementFromClaims } from 'gdc-sdk-client-ts';

describe('SDK entitlements utils', () => {
  test('parses offer summary claims', () => {
    const claims = {
      'org.schema.Offer.identifier': 'urn:offer:123',
      'org.schema.Offer.eligibleQuantity.value': '12',
      'org.schema.Offer.unitPrice.value': '5.00',
      'org.schema.Offer.price.value': '60.00',
      'org.schema.Offer.tax.value': '12.60',
      'org.schema.Offer.checkoutPageURLTemplate': 'https://checkout.example.com/session/abc',
    };

    expect(parseOfferEntitlementFromClaims(claims)).toEqual({
      offerId: 'urn:offer:123',
      quantity: 12,
      unitPrice: '5.00',
      totalPrice: '60.00',
      taxes: '12.60',
      checkoutUrl: 'https://checkout.example.com/session/abc',
    });
  });
});
