import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LogService } from '@core/services/log.service';
import { RegistrationApiService } from '@core/api/registration-api.service';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';
import { EmailVerificationService } from '@core/services/email-verification.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-wish-list-overview',
  templateUrl: './wish-list-overview.page.html',
  styleUrls: ['./wish-list-overview.page.scss'],
})
export class WishListOverviewPage implements OnInit, OnDestroy {

  wishLists: Array<WishListDto> = new Array();
  refreshData: boolean = false

  get disableAddButtons(): boolean {
    return !this.userService.accountIsEnabled;
  };

  private queryParamSubscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private wishListStore: WishListStoreService,
    private navController: NavController,
    private authService: AuthenticationService,
    private logger: LogService,
    private registrationApiService: RegistrationApiService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private emilVerificationService: EmailVerificationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const resolvedData = this.route.snapshot.data;
    this.updateWishLists(resolvedData.wishLists);

    this.queryParamSubscription = this.route.queryParamMap.pipe().subscribe({
      next: queryParams => {
        const token = queryParams.get('emailVerificationToken');
        if (token) {
          this.confirmRegistration(token);
        }
      }
    });
  }

  ngOnDestroy() {
    this.queryParamSubscription.unsubscribe();
  }

  private confirmRegistration(emailVerificationToken: string) {
    this.loadingService.showLoadingSpinner();
    this.registrationApiService.confirmRegistration(emailVerificationToken).subscribe({
      next: response => {
        const jwToken = response.token;
        if (jwToken) {
          this.authService.saveToken(jwToken);
        }
        this.toastService.presentSuccessToast('Deine E-Mail-Adresse wurde erfolgreich bestätigt!');
        this.loadingService.dismissLoadingSpinner();
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {}});
      },
      error: errorResponse => {
        if (errorResponse instanceof HttpErrorResponse) {
          if (errorResponse.error instanceof ErrorEvent) {
            this.logger.log(`Error: ${errorResponse.error.message}`);
          } else if (errorResponse.status === HttpStatusCodes.NOT_FOUND) {
            this.toastService.presentErrorToast('Du hast deine E-Mail Adresse bereits erfolgreich bestätigt.');
          }
        }
        this.loadingService.dismissLoadingSpinner();
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {}});
      }
    })
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
