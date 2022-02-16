import { Directive, ElementRef, Input, OnChanges, OnDestroy } from "@angular/core";
import { Tooltip } from "bootstrap";

@Directive({
  selector: '[uib-tooltip]'
})
export class TooltipDirective implements OnChanges, OnDestroy {
  @Input('uib-tooltip') html: string;
  @Input() placement: 'auto' | 'top' | 'bottom' | 'left' | 'right' = 'auto';
  @Input() container?: string | Element;

  tooltip?: Tooltip;

  constructor(public el: ElementRef){}

  ngOnChanges() {
    this.tooltip?.dispose(); // Force the creation of a new tooltip, or else the content is not updated
    if(this.html) {
      this.tooltip = Tooltip.getOrCreateInstance(this.el.nativeElement, {
        html: true,
        placement: this.placement,
        sanitize: false,
        title: this.html,
        container: this.container || this.el.nativeElement
      });
    }
  }

  ngOnDestroy() {
    this.tooltip?.dispose();
  }
}