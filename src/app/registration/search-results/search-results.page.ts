import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnDestroy } from '@angular/core';
import { SearchResultItem } from '../services/search-result-item';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationForm } from '../registration-form';
import { Subscription } from 'rxjs';
import { RegistrationFormService } from '../registration-form.service';

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
    private formService: RegistrationFormService) {}

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

}
