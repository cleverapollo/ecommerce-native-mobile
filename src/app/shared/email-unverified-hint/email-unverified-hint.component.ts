import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-email-unverified-hint',
  templateUrl: './email-unverified-hint.component.html',
  styleUrls: ['./email-unverified-hint.component.scss'],
})
export class EmailUnverifiedHintComponent implements OnInit {

  @Input() subText: string;

  constructor() { }

  ngOnInit() {
    console.log(this.subText);
  }

}
