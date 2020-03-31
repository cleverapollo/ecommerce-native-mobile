import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchResultItem } from '../../shared/features/product-search/search-result-item';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationForm } from '../registration-form';
import { Subscription } from 'rxjs';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss']
})
export class SearchResultsPage implements OnInit, OnDestroy {

  selectedWish: SearchResultItem;
  wishes: Array<SearchResultItem> = new Array();

  private currentForm: RegistrationForm
  private formSubscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private formService: RegistrationFormService,
    private navController: NavController) {}

  ngOnInit() {
    this.wishes = this.route.snapshot.data.products;
    this.formSubscription = this.formService.form$.subscribe( form => {
      this.currentForm = form
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  updateValue(item: SearchResultItem) {
    this.selectedWish = item;
  }

  next() {
    this.currentForm.wishList.wishes[0] = this.selectedWish;
    this.formService.updateForm(this.currentForm);
    this.router.navigate(['../first-name'], { relativeTo: this.route });
  }

  goBack() {
    this.navController.back();
  }

}
