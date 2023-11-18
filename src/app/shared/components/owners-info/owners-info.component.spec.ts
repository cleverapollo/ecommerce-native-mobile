import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailDto, EmailVerificationStatus, UserDto } from '@core/models/user.model';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Observable, delay, of } from 'rxjs';
import { OwnersInfoComponent } from './owners-info.component';

describe('OwnersInfoComponent', () => {
  let component: OwnersInfoComponent;
  let fixture: ComponentFixture<OwnersInfoComponent>;
  let userStore: Partial<UserProfileStore> = {
    downloadFriendImage(email: EmailDto, forceRefresh: boolean): Observable<Blob> {
      return of(new Blob());
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OwnersInfoComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: UserProfileStore, useValue: userStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles expected states correctly', () => {
    const owner: Partial<UserDto> = {
      email: new EmailDto('max@mustermann@wantic.io', EmailVerificationStatus.VERIFIED)
    };

    component.images = {
      'max@mustermann@wantic.io': {
        loading: false,
        blob: undefined
      }
    }
    expect(component.showSpinner(owner as any)).toBeFalsy();
    expect(component.showPhoto(owner as any)).toBeFalsy();
    expect(component.showInitials(owner as any)).toBeTruthy();
    expect(component.getPhoto(owner as any)).toBeUndefined();

    component.images = {
      'max@mustermann@wantic.io': {
        loading: true,
        blob: undefined
      }
    }
    expect(component.showSpinner(owner as any)).toBeTruthy();
    expect(component.showPhoto(owner as any)).toBeFalsy();
    expect(component.showInitials(owner as any)).toBeFalsy();
    expect(component.getPhoto(owner as any)).toBeUndefined();

    component.images = {
      'max@mustermann@wantic.io': {
        loading: true,
        blob: new Blob()
      }
    }
    expect(component.showSpinner(owner as any)).toBeTruthy();
    expect(component.showPhoto(owner as any)).toBeFalsy();
    expect(component.showInitials(owner as any)).toBeFalsy();
    expectPhoto(component, owner);

    component.images = {
      'max@mustermann@wantic.io': {
        loading: false,
        blob: new Blob()
      }
    }
    expect(component.showSpinner(owner as any)).toBeFalsy();
    expect(component.showPhoto(owner as any)).toBeTruthy();
    expect(component.showInitials(owner as any)).toBeFalsy();
    expectPhoto(component, owner);
  });

  it('shows initials if something goes wrong', () => {
    const owner: Partial<UserDto> = {
      email: new EmailDto('anyUnknownUser', EmailVerificationStatus.VERIFIED)
    };
    component.images = {
      'max@mustermann@wantic.io': {
        loading: false,
        blob: undefined
      }
    }

    expect(component.showInitials(owner as any)).toBeTruthy();

    expect(component.showSpinner(owner as any)).toBeFalsy();
    expect(component.showPhoto(owner as any)).toBeFalsy();
    expect(component.getPhoto(owner as any)).toBeUndefined();
  });

  it('handles backend', fakeAsync(() => {
    const spy = spyOn(userStore, 'downloadFriendImage').and.returnValue(of(new Blob()).pipe(delay(1)));

    component.owners = [
      {
        email: new EmailDto('userWithImage', EmailVerificationStatus.VERIFIED),
        hasImage: true
      } as any,
      {
        email: new EmailDto('userWithoutImage', EmailVerificationStatus.VERIFIED),
        hasImage: false
      } as any,
    ]

    component.ngOnInit();
    tick(1);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.images).toEqual({
      userWithImage: {
        loading: false,
        blob: jasmine.any(Blob)
      },
      userWithoutImage: {
        loading: false
      }
    });
    expect(component.wishListOwnerCount).toBe(2);
  }));

});

function expectPhoto(component: OwnersInfoComponent, owner: Partial<UserDto>) {
  expect(component.getPhoto(owner as any)).toBeDefined();
  expect(component.getPhoto(owner as any)).not.toBeNull();
}