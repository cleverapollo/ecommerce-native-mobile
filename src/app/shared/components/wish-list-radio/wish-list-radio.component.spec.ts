import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishListApiMockService } from '@core/api/wish-list-mock.service';
import { EmailVerificationStatus, InvitationStatus } from '@core/models/user.model';
import { WishListDto, WishListSelectOptionDto } from '@core/models/wish-list.model';
import { LogService } from '@core/services/log.service';
import { MockWishListStoreService } from '@core/services/wish-list-store-mock.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule } from '@ionic/angular';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of, throwError } from 'rxjs';

import { WishListRadioComponent } from './wish-list-radio.component';

describe('WishListRadioComponent', () => {
  let component: WishListRadioComponent;
  let fixture: ComponentFixture<WishListRadioComponent>;

  const wishListStoreService: MockWishListStoreService = new MockWishListStoreService();
  const wishListApiService: WishListApiMockService = new WishListApiMockService();
  const logger = jasmine.createSpyObj('logger', ['error']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListRadioComponent ],
      imports: [IonicModule.forRoot(), LoggerTestingModule],
      providers: [
        FormBuilder,
        { provide: WishListApiService, useValue: wishListApiService },
        { provide: WishListStoreService, useValue: wishListStoreService },
        { provide: LogService, useValue: logger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListRadioComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init if no wish lists are available', () => {
      wishListStoreService.wishLists = [];

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.hasNoWishLists).toBeTruthy();
      expect(component.isEditMode).toBeFalsy();
      expect(component.requestIsRunning).toBeFalsy();
      expect(component.showForm).toBeFalsy();
      expect(component.showLoading).toBeFalsy();
      expect(component.showSaveWishListButton).toBeFalsy();
      expect(component.subscription).not.toBeNull();
      expect(component.wishListSelectOptions).toEqual([]);
      expect(component._wishListId).toBeUndefined();
    });

    it('should init first wish list if only one wish list is available', () => {
      wishListStoreService.wishLists = [WishListTestData.wishListBirthday];

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.hasNoWishLists).toBeFalsy();
      expect(component.isEditMode).toBeFalsy();
      expect(component.requestIsRunning).toBeFalsy();
      expect(component.showForm).toBeFalsy();
      expect(component.showLoading).toBeFalsy();
      expect(component.showSaveWishListButton).toBeFalsy();
      expect(component.subscription).not.toBeNull();
      expect(component.wishListSelectOptions).toEqual([new WishListSelectOptionDto('1', 'Geburtstag')]);
      expect(component._wishListId).toBe('1');
    });

    it('should init first wish list if at least two wish lists are available and no init value is given', () => {
      wishListStoreService.wishLists = [WishListTestData.wishListBirthday, WishListTestData.wishListWedding];

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.hasNoWishLists).toBeFalsy();
      expect(component.isEditMode).toBeFalsy();
      expect(component.requestIsRunning).toBeFalsy();
      expect(component.showForm).toBeFalsy();
      expect(component.showLoading).toBeFalsy();
      expect(component.showSaveWishListButton).toBeFalsy();
      expect(component.subscription).not.toBeNull();
      expect(component.wishListSelectOptions).toEqual([new WishListSelectOptionDto('1', 'Geburtstag'), new WishListSelectOptionDto('2', 'Hochzeit')]);
      expect(component._wishListId).toBe('1');
    });

    it('should init second wish list if two wish lists are available and init value equals id of second wish list', () => {
      wishListStoreService.wishLists = [WishListTestData.wishListBirthday, WishListTestData.wishListWedding];

      component.initialValue = '2';
      fixture.detectChanges();
      component.ngOnInit();

      expect(component.hasNoWishLists).toBeFalsy();
      expect(component.isEditMode).toBeFalsy();
      expect(component.requestIsRunning).toBeFalsy();
      expect(component.showForm).toBeFalsy();
      expect(component.showLoading).toBeFalsy();
      expect(component.showSaveWishListButton).toBeFalsy();
      expect(component.subscription).not.toBeNull();
      expect(component.wishListSelectOptions).toEqual([new WishListSelectOptionDto('1', 'Geburtstag'), new WishListSelectOptionDto('2', 'Hochzeit')]);
      expect(component._wishListId).toBe('2');
    });
  })

  describe('writeValue', () => {

    beforeEach(() => {
      fixture.detectChanges();
    })

    it('should change wish list id if input is string', () => {
      const uuid: String = 'c8d4b4dd-1a61-4edc-bfea-8556b4896aa2';
      component.writeValue(uuid);
      expect(component.wishListId).toBe('c8d4b4dd-1a61-4edc-bfea-8556b4896aa2');
    });

    it('should change wish list id if input is instance of WishListSelectOptionDto', () => {
      const wishList = new WishListSelectOptionDto('afd3f536-d1ca-4656-99d5-4c6465fe941a', 'Geburtstag');
      component.writeValue(wishList);
      expect(component.wishListId).toBe('afd3f536-d1ca-4656-99d5-4c6465fe941a');
    });

    it('should not change wish list id if input has an unexpected type', () => {
      component.wishListId = 'bdd30320-c11b-41d6-872e-d7f98b2d9e1b';

      component.writeValue(undefined);
      expect(component.wishListId).toBe('bdd30320-c11b-41d6-872e-d7f98b2d9e1b');

      component.writeValue(null);
      expect(component.wishListId).toBe('bdd30320-c11b-41d6-872e-d7f98b2d9e1b');

      component.writeValue(WishListTestData.wishListBirthday);
      expect(component.wishListId).toBe('bdd30320-c11b-41d6-872e-d7f98b2d9e1b');
    });
  })

  describe('createNewWishList', () => {

    const createdWishList: WishListDto = {
      id: '54052bb8-51e8-4cdb-8abd-b753d5721603',
      name: 'My new wish list',
      date: new Date(2021, 12, 4),
      wishes: [],
      creatorEmail: 'max@mustermann.de',
      owners: [
        {
          firstName:  'Max',
          email: 'max@mustermann.de',
          emailVerificationStatus: EmailVerificationStatus.VERIFIED,
          invitationStatus: InvitationStatus.ACCEPTED
        }
      ],
      showReservedWishes: false
    }

    beforeEach(() => {
      fixture.detectChanges();
    })

    it('should trigger a new request to save a new wish list', fakeAsync(() => {
      const wishListApiSpy = spyOn(wishListApiService, 'create').and.returnValue(of(createdWishList));
      component.form.controls.name.setValue('My new wish list');
      component.wishListSelectOptions = [
        new WishListSelectOptionDto('b3ae13e3-1104-4e99-a51e-cb9396fc12c9', 'Birthday'),
        new WishListSelectOptionDto('b2d93763-135a-42e9-bbfc-6eb87effc347', 'Wedding'),
        new WishListSelectOptionDto('546466c5-24dc-4bd1-8ac3-46bde5bc4628', 'X-mas'),
      ]

      component.createNewWishList();
      tick();

      expect(component.isEditMode).toBeFalsy();
      expect(component.wishListId).toBe('54052bb8-51e8-4cdb-8abd-b753d5721603');
      expect(wishListApiSpy).toHaveBeenCalledWith({
        name: 'My new wish list',
        showReservedWishes: false
      });
      expect(component.wishListSelectOptions).toEqual([
        jasmine.objectContaining({id: 'b3ae13e3-1104-4e99-a51e-cb9396fc12c9', name: 'Birthday'}),
        jasmine.objectContaining({id: '54052bb8-51e8-4cdb-8abd-b753d5721603', name: 'My new wish list'}),
        jasmine.objectContaining({id: 'b2d93763-135a-42e9-bbfc-6eb87effc347', name: 'Wedding'}),
        jasmine.objectContaining({id: '546466c5-24dc-4bd1-8ac3-46bde5bc4628', name: 'X-mas'}),
      ]);
      expect(component.form.controls.name.value).toBeNull();
      expect(component.requestIsRunning).toBeFalsy();

      flush();
    }));

    it('should not trigger a request if form is invalid', fakeAsync(() => {
      const wishListApiSpy = spyOn(wishListApiService, 'create').and.returnValue(of(createdWishList));

      component.createNewWishList();
      tick();

      expect(wishListApiSpy).not.toHaveBeenCalled();
    }));

    it('should log error if server request failed', fakeAsync(() => {
      const wishListApiSpy = spyOn(wishListApiService, 'create').and.returnValue(throwError('something went wrong'));
      component.form.controls.name.setValue('Christmas 2022');

      component.createNewWishList();
      tick();

      expect(wishListApiSpy).toHaveBeenCalledWith({
        name: 'Christmas 2022',
        showReservedWishes: false
      });
      expect(component.requestIsRunning).toBeFalsy();
      expect(component.form.controls.name.value).toBe('Christmas 2022');
      expect(logger.error).toHaveBeenCalledWith('something went wrong');

      flush();
    }));

  });

  describe('enableEditMode', () => {
    it('should enable the edit mode', () => {
      component.enableEditMode();
      expect(component.isEditMode).toBeTruthy();
    })
  });

  describe('template', () => {

    let buttonEnableEditMode: HTMLIonItemElement;
    let hintNoWishLists: HTMLIonItemElement;
    let radioWishListOptions: Array<DebugElement> = [];
    let form: HTMLFormElement;

    beforeEach(() => {
      fixture.detectChanges();
      queryHtmlElements();
    });

    it('should render button to enable edit mode', () => {
      component.isEditMode = false;
      component.wishListSelectOptions = [];

      fixture.detectChanges();
      queryHtmlElements();

      expect(buttonEnableEditMode).not.toBeNull();
      expect(hintNoWishLists).not.toBeNull();
      expect(form).toBeNull();
      expect(radioWishListOptions.length).toBe(0);
      expect(buttonEnableEditMode.children.length).toBe(2);
    });

    it('should render form if edit mode is enabled', () => {
      component.isEditMode = true;

      fixture.detectChanges();
      queryHtmlElements();

      expect(form).not.toBeNull();
    });

    it('should show a hint if no wish lists are available', () => {
      component.isEditMode = true;
      component.wishListSelectOptions = [];

      fixture.detectChanges();
      queryHtmlElements();

      expect(hintNoWishLists).not.toBeNull();
    });


    it('should render a list of wish list names', () => {
      component.wishListSelectOptions = [
        new WishListSelectOptionDto('b3ae13e3-1104-4e99-a51e-cb9396fc12c9', 'Birthday'),
        new WishListSelectOptionDto('b2d93763-135a-42e9-bbfc-6eb87effc347', 'Wedding'),
        new WishListSelectOptionDto('546466c5-24dc-4bd1-8ac3-46bde5bc4628', 'X-mas'),
      ];
      fixture.detectChanges();
      queryHtmlElements();

      expect(radioWishListOptions.length).toBe(3);
      expect(hintNoWishLists).toBeNull();
    });

    it('should render the selected item in the list', () => {
      component.wishListSelectOptions = [
        new WishListSelectOptionDto('b3ae13e3-1104-4e99-a51e-cb9396fc12c9', 'Birthday'),
        new WishListSelectOptionDto('b2d93763-135a-42e9-bbfc-6eb87effc347', 'Wedding'),
        new WishListSelectOptionDto('546466c5-24dc-4bd1-8ac3-46bde5bc4628', 'X-mas'),
      ];
      component.wishListId = 'b2d93763-135a-42e9-bbfc-6eb87effc347';

      fixture.detectChanges();
      queryHtmlElements();

      let checkedItems = radioWishListOptions[0].queryAll(By.css('.icon-checked'));
      let uncheckedIcons = radioWishListOptions[0].queryAll(By.css('.icon-unchecked'));
      let radioOptionName: HTMLIonLabelElement = radioWishListOptions[0].query(By.css('.radio-option-name')).nativeElement;
      expect(checkedItems.length).toBe(0);
      expect(uncheckedIcons.length).toBe(1);
      expect(radioOptionName.innerHTML).toBe('Birthday');

      checkedItems = radioWishListOptions[1].queryAll(By.css('.icon-checked'));
      uncheckedIcons = radioWishListOptions[1].queryAll(By.css('.icon-unchecked'));
      radioOptionName = radioWishListOptions[1].query(By.css('.radio-option-name')).nativeElement;
      expect(checkedItems.length).toBe(1);
      expect(uncheckedIcons.length).toBe(0);
      expect(radioOptionName.innerHTML).toBe('Wedding');

      checkedItems = radioWishListOptions[2].queryAll(By.css('.icon-checked'));
      uncheckedIcons = radioWishListOptions[2].queryAll(By.css('.icon-unchecked'));
      radioOptionName = radioWishListOptions[2].query(By.css('.radio-option-name')).nativeElement;
      expect(checkedItems.length).toBe(0);
      expect(uncheckedIcons.length).toBe(1);
      expect(radioOptionName.innerHTML).toBe('X-mas');
    })

    function queryHtmlElements() {
      buttonEnableEditMode = fixture.nativeElement.querySelector('.button-enable-edit-mode');
      hintNoWishLists = fixture.nativeElement.querySelector('.hint-no-wish-lists');
      radioWishListOptions = fixture.debugElement.queryAll(By.css('.radio-wish-list-option'));
      form = fixture.nativeElement.querySelector('.form-create-new-wish-list');
    }
  });

});
