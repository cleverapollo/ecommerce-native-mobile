import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { WishListCreate } from './wish-list-new.model';
import { WishListApiService } from '../shared/services/wish-list-api.service';
import { WishListService } from '../shared/services/wish-list.service';
import { LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WishListDto } from '../shared/models/wish-list.model';

@Component({
  selector: 'app-wish-list-new',
  templateUrl: './wish-list-new.page.html',
  styleUrls: ['./wish-list-new.page.scss'],
})
export class WishListNewPage implements OnInit {

  form: FormGroup
  invitedMembers: Array<String>
  newMember: FormControl
  memberIsLoading: Boolean

  loadingSpinner;

  get members() : Array<String> {
    return this.form.controls.members.value 
  }

  get showNoMembersHint() : Boolean {
    return !this.invitedMembers.length && !this.memberIsLoading
  }

  constructor(
    private formBuilder: FormBuilder, 
    private apiService: WishListApiService,
    private wishListService: WishListService,
    private router: Router,
    private navController: NavController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'name': this.formBuilder.control('', [Validators.required]),
      'date': this.formBuilder.control('', [Validators.required]),
      'partner': this.formBuilder.control('', [Validators.email]),
      'members': this.formBuilder.array([])
    });
    this.newMember = this.formBuilder.control('', [Validators.email])
    this.memberIsLoading = false;
    this.invitedMembers = new Array<String>();
  }

  addMember() {
    this.memberIsLoading = true;
    // ToDo: check if user exists in db
    this.invitedMembers.push(this.newMember.value);
    this.newMember.reset();
    this.memberIsLoading = false;
  }

  removeMember(member: String) {
    const index = this.invitedMembers.indexOf(member);
    if (index !== -1) {
      this.invitedMembers.splice(index, 1);
    }
  }

  saveWishList() {
    let wishList = new WishListCreate();
    wishList.name = this.form.controls.name.value;
    wishList.date = this.form.controls.date.value;
    wishList.partners = [];
    wishList.members = [];

    this.loadingController.create({
      message: "Deine Wunschliste wird gerade angelegt..."
    }).then( spinner => {
      spinner.present().then(() => {
        this.apiService.create(wishList).subscribe( (response : WishListDto) => {
          spinner.dismiss().finally(() => {
            this.wishListService.updateSelectedWishList(response);
            this.router.navigate(['wish-list-detail']);
          })
        }, e => {
          spinner.dismiss().finally(() => {
            console.error(e);
          });
        });
      });
    });
  }

  goBack() {
    this.navController.navigateBack('/home');
  }

}
