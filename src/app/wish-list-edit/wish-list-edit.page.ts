import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { WishListApiService } from '../shared/services/wish-list-api.service';
import { WishListService } from '../shared/services/wish-list.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { WishList } from '../home/wishlist.model';
import { WishListEdit } from './wish-list-edit.model';

@Component({
  selector: 'app-wish-list-edit',
  templateUrl: './wish-list-edit.page.html',
  styleUrls: ['./wish-list-edit.page.scss'],
})
export class WishListEditPage implements OnInit, OnDestroy {

  private subscription: Subscription;
  private wishList: WishList;

  form: FormGroup
  invitedMembers: Array<String>
  newMember: FormControl
  memberIsLoading: Boolean

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
    public loadingController: LoadingController
    ) { }

  ngOnInit() {
    this.subscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;
      this.form = this.formBuilder.group({
        'name': this.formBuilder.control(this.wishList.name, [Validators.required]),
        'date': this.formBuilder.control(this.wishList.date, [Validators.required]),
        'partner': this.formBuilder.control('', [Validators.email]),
        'members': this.formBuilder.array([])
      });
    });
    this.newMember = this.formBuilder.control('', [Validators.email])
    this.memberIsLoading = false;
    this.invitedMembers = new Array<String>();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  updateWishList() {
    let wishList = new WishListEdit();
    wishList.name = this.form.controls.name.value;
    wishList.date = this.form.controls.date.value;
    wishList.partners = [];
    wishList.members = [];

    this.loadingController.create({
      message: "Deine Wunschliste wird gerade aktualisiert..."
    }).then( spinner => {
      spinner.present().then(() => {
        this.apiService.update(this.wishList.id, wishList).subscribe( (response : WishList) => {
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

}
