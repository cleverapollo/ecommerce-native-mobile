import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '../shared/services/user-api.service';
import { UserProfile } from '../shared/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ValidationMessages, ValidationMessage } from '../shared/validation-messages/validation-message';
import { CustomValidation } from '../shared/custom-validation';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

  form: FormGroup;
  get validationMessages(): ValidationMessages {
    return {
      firstName: [
        new ValidationMessage('required', 'Gib bitte deinen Vornamen an.'),
        new ValidationMessage('minlength', 'Dein Vorname muss aus mindestens zwei Zeichen bestehen.')
      ],
      lastName: [
        new ValidationMessage('minlength', 'Dein Nachname muss aus mindestens zwei Zeichen bestehen.')
      ],
      birthday: [],
      email: [
        new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
        new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
      ]
    }
  }

  profile: UserProfile

  imageIsUploading: Boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    private userApiService: UserApiService
  ) { }

  ngOnInit() {
    this.profile = this.route.snapshot.data.profile;

    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control(this.profile.firstName, [Validators.required, Validators.min(2)]),
      lastName: this.formBuilder.control(this.profile.lastName, [Validators.min(2)]),
      birthday: this.formBuilder.control(this.profile.birthday),
      email: this.formBuilder.control(this.profile.email, [Validators.required, Validators.email]),
      passwordChange: this.formBuilder.group({
        currentPassword: this.formBuilder.control(''),
        newPassword: this.formBuilder.control(''),
        newPasswordConfirm: this.formBuilder.control('')
      })
    })
  }

  saveChanges() {
    this.profile.firstName = this.form.controls.firstName.value;
    this.profile.lastName = this.form.controls.lastName.value;
    this.profile.birthday = this.form.controls.birthday.value;
    this.profile.email = this.form.controls.email.value;

    this.userApiService.updateProfile(this.profile).subscribe((updatedData: UserProfile) => {
      this.profile = updatedData;
    }, console.error);
  }

  uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {

      let request = new FormData();
      request.append('file', file);
      this.imageIsUploading = true;

      this.userApiService.uploadFile(request).subscribe((response) => {
        this.profile.profileImageUrl = response.fileDownloadUri;
        this.profile.profileImageFileName = response.fileName;
      }, e => console.error, () => {
        this.imageIsUploading = false;
      });
    }
    reader.onerror = (error) => {
      console.error(error);
    }
  }

}
