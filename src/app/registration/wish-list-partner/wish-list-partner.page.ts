import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationForm } from '../registration-form';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wish-list-partner',
  templateUrl: './wish-list-partner.page.html',
  styleUrls: ['./wish-list-partner.page.scss']
})
export class WishListPartnerPage implements OnInit, OnDestroy {

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
      'partner': this.formBuilder.control('', [Validators.email])
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.currentForm.partners = new Array();
    this.currentForm.partners[0] = this.form.controls['partner'].value;
    this.formService.updateForm(this.currentForm);
    this.router.navigate(['../wish-list-wish'], { relativeTo: this.route })
  }

  goBack() {
    this.navController.back();
  }

}
