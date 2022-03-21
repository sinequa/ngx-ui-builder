import { AfterContentInit, Directive, ElementRef, HostBinding, HostListener, Input, OnChanges, OnDestroy } from "@angular/core";
import { Tooltip } from "bootstrap";

@Directive({
  selector: '[uib-tooltip]'
})
export class TooltipDirective implements OnChanges, OnDestroy, AfterContentInit {
  @Input('uib-tooltip') html: string;
  @Input() placement: 'auto' | 'top' | 'bottom' | 'left' | 'right' = 'auto';
  @Input() container?: string | Element;

  tooltip?: Tooltip;
  
  @HostListener('mouseleave', ['$event']) mouseleave(event: MouseEvent) {
    this.tooltip?.hide();
  }
  
  // @Input() it's used to trigger the changes detection cycle for the directive
  @HostBinding('disabled')
  @Input() disabled: boolean;

  constructor(public el: ElementRef){}

  ngOnChanges() {
    // when element is disabled, remove tooltip otherwise it will be shown/created when enabled
    if (this.disabled && this.tooltip) {
      this.tooltip?.dispose();
    } else {
      this.setTooltip();
    }
  }
  
  ngAfterContentInit(): void {
    this.setTooltip();
  }

  ngOnDestroy() {
    this.tooltip?.dispose();
  }
  
  setTooltip() {
    if (this.html) {
      this.tooltip = Tooltip.getOrCreateInstance(this.el.nativeElement, {
        html: true,
        placement: this.placement,
        sanitize: false,
        title: this.html,
        delay: 300,
        container: this.container || this.el.nativeElement
      });
    }
  }
}