import { Directive, ElementRef, Input, OnChanges, OnDestroy } from "@angular/core";
import { Tooltip } from "bootstrap";

export type TooltipPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[uib-tooltip]'
})
export class TooltipDirective implements OnChanges, OnDestroy {
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
    delay: { show: 300, hide: 0 },
    trigger: 'hover'
  };

  /**
   * How to position the tooltip.
   */
  @Input() placement: TooltipPlacement = "auto";

  /**
   * Append the tooltip to a specific element.
   *
   * By default, tooltip is append to `uib-bootstrap` component.
   * When `undefined`, tooltip is append to his host element.
   */
  @Input() container?: string | Element = ".uib-bootstrap";

  tooltip?: Tooltip;

  constructor(public el: ElementRef){}

  ngOnChanges() {
    this.tooltip?.dispose(); // Force the creation of a new tooltip, or else the content is not updated
    if(this.html) {
      this.tooltip = Tooltip.getOrCreateInstance(this.el.nativeElement, {
        ...this.config,
        placement: this.placement,
        title: this.html,
        container: this.container || this.el.nativeElement
      });
    }
  }

  ngOnDestroy() {
    this.tooltip?.dispose();
  }
}
