import { OwnerNamesPipe } from './owner-names.pipe';

describe('OwnerNamesPipe', () => {
  it('create an instance', () => {
    const pipe = new OwnerNamesPipe();
    expect(pipe).toBeTruthy();
  });
});
