import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductList } from '@core/models/product-list.model';
import { Logger } from '@core/services/log.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ListComponent } from './list.component';

describe('ListComponent', () => {

  let logger: Logger
  let userStore: jasmine.SpyObj<UserProfileStore> = jasmine.createSpyObj('UserProfileStore', ['user$']);

  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Logger, useValue: logger },
        { provide: UserProfileStore, useValue: userStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    component.list = {} as ProductList
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
