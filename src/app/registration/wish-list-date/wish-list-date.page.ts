import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationForm } from '../registration-form';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wish-list-date',
  templateUrl: './wish-list-date.page.html',
  styleUrls: ['./wish-list-date.page.scss']
})
export class WishListDatePage implements OnInit, OnDestroy {

  form: FormGroup

  private currentForm: RegistrationForm
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private navController: NavController) { }

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( form => {
      this.currentForm = form
    });
    this.form = this.formBuilder.group({
      'date': this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.currentForm.wishList.date = this.form.controls['date'].value;
    this.formService.updateForm(this.currentForm);
    this.router.navigate(['../wish-list-partner'], { relativeTo: this.route })
  }

  goBack() {
    this.navController.back();
  }


}
