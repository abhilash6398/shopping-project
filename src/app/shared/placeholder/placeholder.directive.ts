import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[app-placeholder]',

})
export class PlaceholderDirective {
  viewContainerRef: any;
  constructor(viewContainerRef: ViewContainerRef) {}

}
