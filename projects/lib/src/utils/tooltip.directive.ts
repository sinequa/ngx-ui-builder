import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnChanges, OnDestroy } from "@angular/core";
import { Tooltip } from "bootstrap";

@Directive({
  selector: '[uib-tooltip]'
})
export class TooltipDirective implements OnChanges, OnDestroy, AfterContentInit {
  @Input('uib-tooltip') html: string;
  
  /**
   * Allow Bootstrap tooltip's options configuration
   * 
   * * `title`, `placement` and `container` options are removed from Bootstrap options as they use their own inputs.
   * * `html`, `sanitize`, `delay` and `trigger` options are sets with different values as well by default but can
   * be overriden here.
   */
  @Input() config?: Partial<Omit<Tooltip.Options, 'title' | 'placement' | 'container'>> = {
    html: true,
    sanitize: false,
    delay: 300,
    trigger: 'hover'
  };
  
  /**
   * How to position the tooltip.
   */
  @Input() placement: 'auto' | 'top' | 'bottom' | 'left' | 'right' = 'auto';
  
  /**
   * Append the tooltip to a specific element.
   * 
   * By default, tooltip is append to `uib-toolbar` component.
   * When `undefined`, tooltip is append to his host element.
   */
  @Input() container?: string | Element = "uib-toolbar";

  tooltip?: Tooltip;
    
  // @Input() it's used to trigger the changes detection cycle for the directive
  @HostBinding('disabled')
  @Input() disabled: boolean;

  constructor(public el: ElementRef){}

  ngOnChanges() {
    // when element is disabled, remove tooltip otherwise it will be shown/created when enabled
    this.tooltip?.dispose();
    this.setTooltip();
  }
  
  ngAfterContentInit(): void {
    this.setTooltip();
  }

  ngOnDestroy() {
    this.tooltip?.dispose();
  }
  
  /**
   * * If the `html` property is set, create a tooltip with the `Tooltip.getOrCreateInstance` method
   */
  setTooltip() {
    if (this.html) {
      // tooltip trigger by default is now 'hover' instead of 'hover focus'
      // this, prevents tooltip display on component focused
      this.tooltip = Tooltip.getOrCreateInstance(this.el.nativeElement, {
        ...this.config,
        placement: this.placement,
        title: this.html,
        container: this.container || this.el.nativeElement,
      });
    }
  }
}