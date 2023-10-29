import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreatorProductListDetailPage } from './creator-product-list-detail.page';

describe('CreatorProductListDetailPage', () => {
  let component: CreatorProductListDetailPage;
  let fixture: ComponentFixture<CreatorProductListDetailPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CreatorProductListDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
