import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { WishListApiService } from '../shared/api/wish-list-api.service';
import { WishListService } from '../shared/services/wish-list.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { WishListEdit, InivtedMemberDisplayInfo, MemberToInvite } from './wish-list-edit.model';
import { AlertService } from '../shared/services/alert.service';
import { UserApiService } from '../shared/api/user-api.service';
import { WishListDto, MemberToInviteDto, WishListMemberDto, PartnerToInviteDto, WishListPartnerDto } from '../shared/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '../shared/validation-messages/validation-message';
import { FriendSelectOption } from '../shared/models/friend.model';

@Component({
  selector: 'app-wish-list-edit',
  templateUrl: './wish-list-edit.page.html',
  styleUrls: ['./wish-list-edit.page.scss'],
})
export class WishListEditPage implements OnInit, OnDestroy {

  private subscription: Subscription;
  private wishList: WishListDto;

  form: FormGroup;
  newMemberForm: FormGroup;
  newPartnerForm: FormGroup;

  get validationMessages(): ValidationMessages {
    return {
      wishListName: [
        new ValidationMessage('required', 'Vergib für deine Wunschliste bitte einen Namen.')
      ],
    }
  }

  invitedMembers: Array<InivtedMemberDisplayInfo>
  friends: Array<FriendSelectOption>;
  memberIsLoading: Boolean = false;
  memberNotFound: Boolean = false;

  partnerIsLoading: Boolean = false;

  get showNoMembersHint() : Boolean {
    return !this.invitedMembers.length && !this.memberIsLoading
  }

  constructor(    
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private apiService: WishListApiService,
    private wishListService: WishListService,
    private router: Router,
    public loadingController: LoadingController,
    public alertService: AlertService,
    private navController: NavController,
    private userApiService: UserApiService
    ) { }

  ngOnInit() {
    this.subscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;

      const partner = this.wishList.partner;

      this.form = this.formBuilder.group({
        'name': this.formBuilder.control(this.wishList.name, [Validators.required]),
        'date': this.formBuilder.control(this.wishList.date, [Validators.required]),
        'partner': this.formBuilder.control(partner ? partner.name: null),
        'members': this.formBuilder.control(this.wishList.members),
        'membersToInvite': this.formBuilder.array(this.wishList.membersToInvite)
      });

      const partnerToInvite = this.wishList.partnerToInvite;
      this.newPartnerForm = this.formBuilder.group({
        'email': this.formBuilder.control(partnerToInvite ?  partnerToInvite.email : '', [Validators.email]),
        'name': this.formBuilder.control(partnerToInvite ? partnerToInvite.name : '', [Validators.minLength(2)])
      });

      this.invitedMembers = this.form.controls.members.value.map( m => InivtedMemberDisplayInfo.forMember(m));
      this.friends = this.route.snapshot.data.friends;
    });

    this.newMemberForm = this.formBuilder.group({
      'email': this.formBuilder.control('', [Validators.email]),
      'name': this.formBuilder.control('')
    });
 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addMember() {
    const email = this.newMemberForm.controls.email.value;
    if (!this.memberNotFound) {
      this.memberIsLoading = true;
      this.userApiService.searchUserByEmail(email).subscribe((response) => {
     
        if (response.userExists) {
          this.invitedMembers.push(InivtedMemberDisplayInfo.forUserSearchResult(response));
          this.form.controls.members.value.push(WishListMemberDto.forUserSearchResult(response));
          this.newMemberForm.reset();
        } else {
          this.memberNotFound = true;
          this.newMemberForm.controls.name.setValidators([Validators.minLength(2), Validators.required]);
          this.newMemberForm.controls.name.updateValueAndValidity();
        }
        
      }, e => console.error(e), () => {
        this.memberIsLoading = false;
      });
    } else {
      const name =  this.newMemberForm.controls.name.value;
      const memberToInvite = new MemberToInviteDto(name, email);
      this.form.controls.membersToInvite.value.push(memberToInvite);
      this.invitedMembers.push(InivtedMemberDisplayInfo.forMemberToInvite(memberToInvite));
      this.memberNotFound = false;
      this.newMemberForm.reset();
    }
  }

  addPartner() {
    const email = this.newPartnerForm.controls.email.value;
    this.partnerIsLoading = true;
    this.userApiService.searchUserByEmail(email).subscribe((response) => {
      if (response.userExists) {
        this.form.controls.partner.setValue(WishListPartnerDto.forUserSearchResult(response));
        this.newPartnerForm.reset();
      } else {

        this.form.controls.partner.setValue(null);
      }
    }, e => console.error(e), () => {
      this.partnerIsLoading = false;
    });
  }

  removeMember(displayInfo: InivtedMemberDisplayInfo) {
    const member = this.findMemberById(this.wishList, displayInfo.id);
    if (member) {
      const index = this.form.controls.members.value.indexOf(member);
      if (index !== -1) {
        this.form.controls.members.value.splice(index, 1);
        this.invitedMembers.splice(this.invitedMembers.indexOf(displayInfo), 1);
      }
    }
  }

  private findMemberById(wishList: WishListDto, id: String) : WishListMemberDto {
    let result = null;
    if (id) {
        const member = wishList.members.find((m) => m.email === id);
        const preactiveMember = wishList.members.find((m) => m.preactiveUserId === id);
        result = member ? member : preactiveMember;
    }
    return result;
}

  updateWishList() {
    let wishList = new WishListDto();
    wishList.name = this.form.controls.name.value;
    wishList.date = this.form.controls.date.value;
    wishList.membersToInvite = this.form.controls.membersToInvite.value;

    const partnerEmail = this.form.controls.partner.value;
    if (partnerEmail) {
      let wishListPartner = this.wishList.partner;
      wishListPartner.email = partnerEmail;
      wishList.partner = wishListPartner;
    }

    const name = this.newPartnerForm.controls.name.value;
    const email = this.newPartnerForm.controls.email.value;
    if (name && email) {
      wishList.partnerToInvite = new PartnerToInviteDto(name, email);
    }

    const memberEmails = this.form.controls.members.value as Array<FriendSelectOption>;
    const memberDtos = memberEmails.map(f => WishListMemberDto.forFriendSelectOption(f));
    wishList.members = memberDtos;

    this.loadingController.create({
      message: "Deine Wunschliste wird gerade aktualisiert..."
    }).then( spinner => {
      spinner.present().then(() => {
        this.apiService.update(this.wishList.id, wishList).subscribe( (response : WishListDto) => {
          spinner.dismiss().finally(() => {
            this.wishList = response;
            this.wishListService.updateSelectedWishList(response);
            // this.router.navigate(['wish-list-detail']);
          })
        }, e => {
          spinner.dismiss().finally(() => {
            console.error(e);
          });
        });
      });
    });
  }

  deleteWishList() {
    const header = 'Wunschliste löschen';
    const message =  `Möchtest du deine Wunschliste ${this.wishList.name} wirklich löschen?`;
    this.alertService.createDeleteAlert(header, message, this.onDeleteConfirmation).then( alert => {
      alert.present();
    })
  }

  private onDeleteConfirmation = (value) => {
    this.loadingController.create({
      message: "Deine Wunschliste wird gerade gelöscht..."
    }).then(spinner => {
      spinner.present().then(() => {
        this.apiService.delete(this.wishList.id)
          .toPromise()
          .then(emptyResponse => {
            this.subscription.unsubscribe();
            spinner.dismiss().finally(() => {
              this.router.navigate(['home']);
            });
          })
          .catch(e => {
            spinner.dismiss().finally(() => {
              console.error(e);
            });
          });
      }, e => {
        spinner.dismiss().finally(() => {
          console.error(e);
        });
      })
    })
  }

  goBack() {
    this.navController.navigateBack('/wish-list-detail')
  }

  compareWith = (o1, o2) => {
    return o1 && o2 ? o1.email === o2.email  : o1 == o2;
  }

}
