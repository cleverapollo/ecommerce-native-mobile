import { CacheImagePipe } from './cache-image.pipe';

describe('CacheImagePipe', () => {
  xit('create an instance', () => {
    const userProfileStoreSpy = jasmine.createSpyObj('UserProfileStore', ['loadImage']);
    const domSanitzerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl'])
    const pipe = new CacheImagePipe(domSanitzerSpy, userProfileStoreSpy);
    expect(pipe).toBeTruthy();
  });
});
