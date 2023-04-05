import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { filter, fromEvent, map, merge, Subscription } from 'rxjs';
import { ZoneContextService } from '../dynamic-views/zone/zone-context.service';

import { Configurable, ConfigurableService } from './configurable.service';

@Directive({
  selector: '[uib-configurable]',
  standalone: true
})
export class ConfigurableDirective implements OnInit, OnDestroy {
  /**
   * Element's id (not zone's id)
   */
  @Input() id: string;
  /**
   * Parent's element id
   */
  @Input() parentId: string;
  /**
   * When zone's data exists, which index is used to display the relative data's informations
   */
  @Input() dataIndex?: number;
  @Input("uib-disable-if") disableIf?: any;

  nativeElement: HTMLElement;

  private subscription: Subscription;

  constructor(
    public zoneRef: ZoneContextService,
    private configurableService: ConfigurableService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    { nativeElement }: ElementRef
  ) {
    this.nativeElement = nativeElement;
  }

  ngOnInit(): void {
    this.configurableService.configurableDirectiveMap.set(this.id, this);

    this.subscription = merge(
      fromEvent(this.nativeElement, "mouseover"),
      fromEvent(this.nativeElement, "mouseenter"),
      fromEvent(this.nativeElement, "mouseleave")
    ).pipe(
      filter(() => !this.disableIf),
      map(x => x?.type)
    ).subscribe(type => {
      switch (type) {
        case "mouseover":
          this.configurableService.mouseoverConfigurable(this.id);
          break;
        case "mouseenter":
          this.configurableService.mouseenterConfigurable(this.id);
          break;
        case "mouseleave":
          this.configurableService.mouseleaveConfigurable();
          break;
      }
      this.cdr.markForCheck();
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostBinding('class')
  get _class() {
    if(this.disableIf) return '';
    return `uib-configurable ${this.highlight() ? 'highlight' : ''}`;
  }

  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    if(this.disableIf) return;
    event.stopPropagation();

    // before to set 'edited' class to current element
    // send it to configurableService to update the previous element and call it's removeEdited() method
    const conf: Configurable = {
      id: this.id,
      parentId: this.parentId,
      dataIndex: this.dataIndex,
      zone: this.zoneRef.id,
      templates: this.zoneRef.templates,
      data: this.zoneRef.data,
      conditionsData: this.zoneRef.conditionsData,
      removeEdited: this.removeEdited.bind(this),
      removeSelected: this.removeSelected.bind(this)
    };
    this.configurableService.clickConfigurable(conf);

    // now, previous 'edited' class should be correct,
    // we can safely set the 'edited' class to the current element
    if (this.nativeElement.classList.contains('edited')) {
      this.removeEdited();
      this.removeSelected();
    } else {
      if (this.zoneRef.id) {
        const el = this.configurableService.configurableDirectiveMap.get(this.zoneRef.id);
        el?.nativeElement.setAttribute("selected","")
      }

      this.renderer.addClass(this.nativeElement, 'edited');
    }
  }

  /**
   * removes the `edited` class from the `nativeElement`
   */
  removeEdited() {
    this.renderer.removeClass(this.nativeElement, 'edited');
  }

  /**
   * removes the `selected` class from the `nativeElement`
   */
  removeSelected() {
    if (this.zoneRef.id) {
      const el = this.configurableService.configurableDirectiveMap.get(this.zoneRef.id);
      el?.nativeElement.removeAttribute("selected");
    }
  }

  /**
   * removes the `highlight` class from the `nativeElement`
   */
  removeHighlight() {
    this.renderer.removeClass(this.nativeElement, 'highlight');
  }

  /**
   * adds the `highlight` class to the `nativeElement`
   */
  addHighlight() {
    this.renderer.addClass(this.nativeElement, 'highlight');
  }

  /**
   * If the id of the current instance of the component is the same as the id of
   * the hovered component, then return true
   * @returns The id of the current item is being compared to the hoveredId of the
   * configurableService.
   */
  highlight() {
    return this.id === this.configurableService.hoveredId;
  }
}
