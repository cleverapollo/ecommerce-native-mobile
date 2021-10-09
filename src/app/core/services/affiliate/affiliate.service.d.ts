interface AffiliateService {
    createAffiliateLink(productUrlString: string): Promise<string>;
    supportsDomain(domain: string): boolean;
}
