import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[modalLoader]',
  standalone: true
})
export class ModalLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
