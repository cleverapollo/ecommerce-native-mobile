import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
})
export class HintComponent implements OnInit {

  @Input() type: "default" | "success" | "danger" | "info";
  @Input() text: String

  constructor() { }

  ngOnInit() {
    console.log(this.type, this.text);
  }

}
