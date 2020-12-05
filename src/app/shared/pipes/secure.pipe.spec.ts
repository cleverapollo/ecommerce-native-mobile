import { SecurePipe } from './secure.pipe';

describe('SecurePipe', () => {
  xit('create an instance', () => {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const domSanitzerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl'])
    const pipe = new SecurePipe(httpClientSpy, domSanitzerSpy);
    expect(pipe).toBeTruthy();
  });
});
