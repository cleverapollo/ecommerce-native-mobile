import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { RegistrationForm } from '../registration-form';
import { Observable, Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wish-list-name',
  templateUrl: './wish-list-name.page.html',
  styleUrls: ['./wish-list-name.page.scss']
})
export class WishListNamePage implements OnInit, OnDestroy {

  form: FormGroup

  private currentForm: RegistrationForm
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private navController: NavController) {}

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( form => {
      this.currentForm = form
    });
    this.form = this.formBuilder.group({
      'name': this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.currentForm.wishList.name = this.form.controls['name'].value;
    this.formService.updateForm(this.currentForm);
    this.router.navigate(['../wish-list-date'], { relativeTo: this.route })
  }

  goBack() {
    this.navController.back();
  }

}
