import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { TemplateNameDirective } from '../utils';

import { Configurable, ConfigurableService } from './configurable.service';

@Directive({
  selector: '[uib-configurable]',
})
export class ConfigurableDirective implements Configurable, OnInit {
  @Input() id: string;
  @Input() zone: string;
  @Input() parentId: string;
  @Input() templates?: Record<string, TemplateNameDirective>;
  @Input() data?: any;
  @Input() dataIndex?: number;
  @Input() conditionsData?: Record<string, any>;
  @Input("uib-disable-if") disableIf?: any;
  
  nativeElement: HTMLElement;

  constructor(
    private configurableService: ConfigurableService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.nativeElement = this.el.nativeElement;
  }

  ngOnInit(): void {
    this.configurableService.configurableDirectiveMap.set(this.id, this);
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
      this.removeSelected();
    } else {
      if (this.zone) {
        const el = this.configurableService.configurableDirectiveMap.get(this.zone);
        el?.nativeElement.setAttribute("selected","")
      }
  
      this.renderer.addClass(this.el.nativeElement, 'edited');
    }
  }
  
  removeEdited() {
    this.renderer.removeClass(this.el.nativeElement, 'edited');
  }
  
  removeSelected() {
    if (this.zone) {
      const el = this.configurableService.configurableDirectiveMap.get(this.zone);
      el?.nativeElement.removeAttribute("selected");
    }
  }
  
  removeHighlight() {
    this.renderer.removeClass(this.el.nativeElement, 'highlight');
  }
  
  addHighlight() {
    this.renderer.addClass(this.el.nativeElement, 'highlight');
  }

  highlight() {
    return this.id === this.configurableService.hoveredId;
  }
}
