import { Injectable } from '@angular/core';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreatorService {

  private _selectedCreator$ = new BehaviorSubject<ContentCreatorAccount | null>(null);
  selectedCreator$ = this._selectedCreator$.asObservable();

  constructor() { }

  setSelectedCreator(creator: ContentCreatorAccount | null) {
    this._selectedCreator$.next(creator);
  }
}
