import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchResultItem, SearchResultItemMapper } from '@shared/features/product-search/search-result-item';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';
import { RegistrationDto } from '../registration-form';
import { WishDto } from '@core/models/wish-list.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss']
})
export class SearchResultsPage implements OnInit, OnDestroy {

  wishes: Array<SearchResultItem> = new Array();

  private registrationDto: RegistrationDto
  private formSubscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private formService: RegistrationFormService,
    private navController: NavController) {}

  ngOnInit() {
    this.wishes = this.route.snapshot.data.products;
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto as RegistrationDto;
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  updateValue(item: SearchResultItem) {
    this.registrationDto.wishListWish = SearchResultItemMapper.map(item, new WishDto());
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../first-name'], { relativeTo: this.route });
  }

}
