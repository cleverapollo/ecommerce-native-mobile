import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

  form: FormGroup

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control('', [Validators.required, Validators.min(2)]),
      lastName: this.formBuilder.control('', [Validators.min(2)]),
      birthday: this.formBuilder.control('', []),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      passwordChange: this.formBuilder.group({
        currentPassword: this.formBuilder.control(''),
        newPassword: this.formBuilder.control(''),
        newPasswordConfirm: this.formBuilder.control('')
      })
    })
  }

  saveChanges() {}

}
