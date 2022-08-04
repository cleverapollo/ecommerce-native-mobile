import { Component, Input } from '@angular/core';

export type HintType = 'default' | 'success' | 'danger' | 'info';
export class HintConfig {
  type: HintType;
  text: string

  constructor(type: HintType, text: string) {
    this.type = type;
    this.text = text;
  }
}

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
})
export class HintComponent {

  @Input() config: HintConfig

  constructor() { }

}

export const hintConfigForSuccessResponse = new HintConfig('success', 'Deine Änderungen wurden erfolgreich gespeichert!');
export const hintConfigForErrorResponse = new HintConfig('danger', 'Deine Änderungen konnten leider nicht gespeichert werdem!');