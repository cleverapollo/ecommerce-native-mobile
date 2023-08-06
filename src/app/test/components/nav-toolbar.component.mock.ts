import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UrlTree } from "@angular/router";

@Component({ selector: 'app-nav-toolbar', template: '' })
export class NavToolbarComponentFake {
  @Input() showBackButton: boolean = false;
  @Input() skipToPath?: string | any[] | UrlTree;
  @Input() defaultHref: string | undefined = undefined;

  @Input() disableNextButton = false;
  @Output() nextButtonClick = new EventEmitter();
}