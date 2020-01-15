import { Component, OnInit } from '@angular/core';
import { RegistrationFormService } from '../registration-form.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent implements OnInit {

  constructor(
    private stateService: RegistrationFormService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) {

   }

  ngOnInit() {
    this.stateService.changeButtonClickEvent(() => {
      this.router.navigate(['../wish-list-name'], {relativeTo: this.activatedRoute});
    })
  }

}
