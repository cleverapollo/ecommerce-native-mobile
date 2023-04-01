import { Component, Input } from "@angular/core";

@Component({ selector: 'app-nav-toolbar', template: '' })
export class NavToolbarComponentFake {
  @Input() showBackButton: boolean = false;
}