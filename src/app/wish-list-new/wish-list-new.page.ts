import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { WishListCreate } from './wish-list-new.model';
import { WishListApiService } from '../shared/api/wish-list-api.service';
import { WishListService } from '../shared/services/wish-list.service';
import { LoadingController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { WishListDto, WishListMemberDto } from '../shared/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '../shared/validation-messages/validation-message';
import { FriendSelectOption } from '../shared/models/friend.model';

@Component({
  selector: 'app-wish-list-new',
  templateUrl: './wish-list-new.page.html',
  styleUrls: ['./wish-list-new.page.scss'],
})
export class WishListNewPage implements OnInit {

  form: FormGroup;
  
  get validationMessages(): ValidationMessages {
    return {
      name: [
        new ValidationMessage('required', 'Vergib bitte einen Namen für deine Wunschliste.')
      ],
      date: [
        new ValidationMessage('required', 'Gib bitte ein Datum an, an welches deine Wunschliste gebunden ist.')
      ],
      partner: [
        new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.')
      ],
      newMember: [
        new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.')
      ],
    }
  };

  invitedMembers: Array<String>;
  newMember: FormControl;
  memberIsLoading: Boolean;
  friends: Array<FriendSelectOption>;

  loadingSpinner;

  get members() : Array<String> {
    return this.form.controls.members.value 
  }

  get showNoMembersHint() : Boolean {
    return !this.invitedMembers.length && !this.memberIsLoading
  }

  constructor(
    private route: ActivatedRoute,
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
      'members': this.formBuilder.control([null])
    });
    this.newMember = this.formBuilder.control('', [Validators.email])
    this.memberIsLoading = false;
    this.invitedMembers = new Array<String>();
    this.friends = this.route.snapshot.data.friends;
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

    const memberEmails = this.form.controls.members.value as Array<FriendSelectOption>;
    const memberDtos = memberEmails.map(f => WishListMemberDto.forFriendSelectOption(f));
    wishList.members = memberDtos;

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
