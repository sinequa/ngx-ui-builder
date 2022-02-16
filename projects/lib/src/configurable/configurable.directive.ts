import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
  TemplateRef,
} from '@angular/core';

import { Configurable, ConfigurableService } from './configurable.service';

@Directive({
  selector: '[uib-configurable]',
})
export class ConfigurableDirective implements Configurable {
  @Input() id: string;
  @Input() zone: string;
  @Input() enableContainers?: boolean;
  @Input() templates?: Record<string, TemplateRef<any>>;
  @Input() data?: any;
  @Input() dataIndex?: number;
  @Input("uib-disable-if") disableIf?: any;

  constructor(
    private configurableService: ConfigurableService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @HostBinding('class')
  get _class() {
    if(this.disableIf) return '';
    return `uib-configurable ${this.highlight() ? 'highlight' : ''}`;
  }

  @HostListener('mouseover', ['$event'])
  mouseover(event: MouseEvent) {
    if(this.disableIf) return;
    this.configurableService.mouseoverConfigurable(this);
  }

  @HostListener('mouseenter', ['$event'])
  mousenter(event: MouseEvent) {
    if(this.disableIf) return;
    this.configurableService.mouseenterConfigurable(this);
  }

  @HostListener('mouseleave', ['$event'])
  mouseleave(event: MouseEvent) {
    if(this.disableIf) return;
    this.configurableService.mouseleaveConfigurable(this);
  }

  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    if(this.disableIf) return;
    event.stopPropagation();
    
    // before to set 'edited' class to current element
    // send it to configurableService to update the previous element and call it's removeEdited() method
    this.configurableService.clickConfigurable(this);
    
    // now, previous 'edited' class should be correct,
    // we can safely set the 'edited' class to the current element
    if (this.el.nativeElement.classList.contains('edited')) {
      this.removeEdited();
    } else {
      this.renderer.addClass(this.el.nativeElement, 'edited');
    }
  }
  
  removeEdited() {
    this.renderer.removeClass(this.el.nativeElement, 'edited');
  }

  highlight() {
    return this.id === this.configurableService.hoveredId;
  }
}
