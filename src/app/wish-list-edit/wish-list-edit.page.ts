import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { WishListApiService } from '../shared/services/wish-list-api.service';
import { WishListService } from '../shared/services/wish-list.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { WishListEdit, InivtedMemberDisplayInfo, MemberToInvite } from './wish-list-edit.model';
import { AlertService } from '../shared/services/alert.service';
import { UserApiService } from '../shared/services/user-api.service';
import { WishListDto, MemberToInviteDto, WishListMemberDto } from '../shared/models/wish-list.model';

@Component({
  selector: 'app-wish-list-edit',
  templateUrl: './wish-list-edit.page.html',
  styleUrls: ['./wish-list-edit.page.scss'],
})
export class WishListEditPage implements OnInit, OnDestroy {

  private subscription: Subscription;
  private wishList: WishListDto;

  form: FormGroup
  newMemberForm: FormGroup;

  invitedMembers: Array<InivtedMemberDisplayInfo>
  
  memberIsLoading: Boolean = false;
  memberNotFound: Boolean = false;

  get showNoMembersHint() : Boolean {
    return !this.invitedMembers.length && !this.memberIsLoading
  }

  constructor(    
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
      this.form = this.formBuilder.group({
        'name': this.formBuilder.control(this.wishList.name, [Validators.required]),
        'date': this.formBuilder.control(this.wishList.date, [Validators.required]),
        'partner': this.formBuilder.control('', [Validators.email]),
        'members': this.formBuilder.array(this.wishList.members),
        'membersToInvite': this.formBuilder.array(this.wishList.membersToInvite)
      });
      this.invitedMembers = this.form.controls.members.value.map( m => InivtedMemberDisplayInfo.forMember(m));
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
    wishList.members = this.form.controls.members.value;
    wishList.membersToInvite = this.form.controls.membersToInvite.value;

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

}
