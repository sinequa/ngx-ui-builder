import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Configurable, ConfigurableService } from './configurable.service';

@Directive({
  selector: '[uib-configurable]',
})
export class ConfigurableDirective implements OnDestroy, Configurable {
  @Input() id: string;
  @Input() zone: string;
  @Input() enableContainers?: boolean;
  @Input() templates?: Record<string, TemplateRef<any>>;

  sub: Subscription;

  constructor(
    private configurableService: ConfigurableService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.sub = this.configurableService.edited$.subscribe((configurable) => {
      if (configurable.id === this.id) {
        this.renderer.addClass(this.el.nativeElement, 'edited');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'edited');
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostBinding('class')
  get _class() {
    return `sq-configurable ${this.highlight() ? 'highlight' : ''}`;
  }

  @HostListener('mouseover', ['$event'])
  mouseover(event: MouseEvent) {
    this.configurableService.mouseoverConfigurable(this);
  }

  @HostListener('mouseenter', ['$event'])
  mousenter(event: MouseEvent) {
    this.configurableService.mouseenterConfigurable(this);
  }

  @HostListener('mouseleave', ['$event'])
  mouseleave(event: MouseEvent) {
    this.configurableService.mouseleaveConfigurable(this);
  }

  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    event.stopPropagation();
    this.configurableService.clickConfigurable(this);
  }

  highlight() {
    return this.id === this.configurableService.hoveredId;
  }
}
