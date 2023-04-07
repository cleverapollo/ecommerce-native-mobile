import { Component, Input, OnInit } from '@angular/core';
import { ContentCreatorAccount } from '@core/models/content-creator.model';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class CreatorComponent implements OnInit {

  @Input() account: ContentCreatorAccount;
  @Input() showShareButton: boolean = false;

  constructor() { }

  ngOnInit() { }

}
