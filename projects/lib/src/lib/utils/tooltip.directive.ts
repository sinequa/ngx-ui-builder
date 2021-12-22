import { Directive, ElementRef, Input, OnChanges, OnDestroy } from "@angular/core";
import { Tooltip } from "bootstrap";

@Directive({
  selector: '[uib-tooltip]'
})
export class TooltipDirective implements OnChanges, OnDestroy {
  @Input('uib-tooltip') html: string;
  @Input() placement: 'auto' | 'top' | 'bottom' | 'left' | 'right' = 'auto';

  tooltip?: Tooltip;

  constructor(public el: ElementRef){}

  ngOnChanges() {
    if(this.html) {
      this.tooltip = Tooltip.getOrCreateInstance(this.el.nativeElement, {
        html: true,
        placement: this.placement,
        sanitize: false,
        title: this.html,
        container: this.el.nativeElement
      });
    }
    else {
      this.tooltip?.dispose();
    }
  }

  ngOnDestroy() {
    this.tooltip?.dispose();
  }
}