import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { Location } from '@angular/common';
import { LoginResponse } from '@core/models/login.model';
import { LogService } from '@core/services/log.service';
import { RegistrationApiService } from '@core/api/registration-api.service';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';
import { EmailVerificationService } from '@core/services/email-verification.service';
import { EmailVerificationStatus } from '@core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-list-overview',
  templateUrl: './wish-list-overview.page.html',
  styleUrls: ['./wish-list-overview.page.scss'],
})
export class WishListOverviewPage implements OnInit, OnDestroy {

  wishLists: Array<WishListDto> = new Array();
  emailVerificationResponse?: LoginResponse;
  refreshData: boolean = false

  disableAddButtons: boolean = false;
  private emilVerificationSubscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private wishListStore: WishListStoreService,
    private navController: NavController,
    private authService: AuthenticationService,
    private location: Location,
    private logger: LogService,
    private registrationApiService: RegistrationApiService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private emilVerificationService: EmailVerificationService
  ) { }

  ngOnInit() {
    this.initData();
    this.handleEmailVerfificationResponseIfNeeded();
    this.confirmRegistration();
  }

  ngOnDestroy(): void {
    this.emilVerificationSubscription.unsubscribe();
  }

  initData() {
    const resolvedData = this.route.snapshot.data;
    this.updateWishLists(resolvedData.wishLists);
    if (resolvedData.emailVerificationResponse) {
      this.emailVerificationResponse = resolvedData.emailVerificationResponse;
    }
    this.emilVerificationSubscription = this.emilVerificationService.emailVerificationStatus.subscribe({
      next: status => {
        this.disableAddButtons = status !== EmailVerificationStatus.VERIFIED;
      }
    })
  }

  private confirmRegistration() {
    this.route.queryParamMap.subscribe({
      next: params => {
        const token = params.get('emailVerificationToken');
        if (token !== null) {
          this.loadingService.showLoadingSpinner();
          this.registrationApiService.confirmRegistration(token).toPromise().then(response => {
            this.emailVerificationResponse = response;
            this.handleEmailVerfificationResponseIfNeeded();
            this.toastService.presentSuccessToast('Deine E-Mail-Adresse wurde erfolgreich bestätigt!');
          }).finally(() => {
            this.loadingService.dismissLoadingSpinner();
          });
        }
      }
    });
  }

  handleEmailVerfificationResponseIfNeeded() {
    if (this.emailVerificationResponse) {
      const jwToken = this.emailVerificationResponse.token;
      if (jwToken) {
        this.authService.saveToken(jwToken);
      }
      this.location.replaceState('secure/home/wish-list-overview')
    }
  }

  ionViewWillEnter() {
    if (this.refreshData) {
      this.wishListStore.loadWishLists(false).subscribe( wishLists => {
        this.updateWishLists(wishLists)
      })
    }
  }

  ionViewDidLeave() {
    this.refreshData = true;
  }

  selectWishList(wishList: WishListDto) {
    this.navController.navigateForward(`secure/home/wish-list/${wishList.id}`);
  }

  forceRefresh(event) {
    this.wishListStore.loadWishLists(true).subscribe(wishLists => {
      this.updateWishLists(wishLists);
    }, this.logger.error, () => {
      event.target.complete();
    });
    this.emilVerificationService.updateEmailVerificationStatusIfNeeded();
  }

  private updateWishLists(wishLists: Array<WishListDto>) {
    this.wishLists = wishLists;
    this.wishLists.sort((wishListA, wishListB) => {
      return this.getTime(wishListA.date) - this.getTime(wishListB.date);
    })
  }

  private getTime(date?: Date) {
    if (date != null) {
      return !this.dateIsInPast(date) ? new Date(date).getTime() : new Date(3000, 1).getTime();
    }
    return new Date(4000, 1).getTime();
  }

  private dateIsInPast(date: Date): boolean {
    const isoDate = new Date(date);
    const now = new Date();
    now.setHours(0,0,0,0);
    return isoDate < now;
  }

}
