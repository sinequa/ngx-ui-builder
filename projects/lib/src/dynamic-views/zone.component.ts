import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  QueryList,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { TemplateNameDirective } from '../utils/template-name.directive';
import { ConfigService } from '../configuration/config.service';
import { Subscription } from 'rxjs';
import { DragDropService } from './drag-drop.service';

@Component({
  selector: 'uib-zone',
  templateUrl: './zone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneComponent implements AfterContentInit, OnInit, OnDestroy {
  @ContentChildren(TemplateNameDirective)
  children: QueryList<TemplateNameDirective>;
  templates: Record<string, TemplateNameDirective> = {};

  @Input() id: string;
  @Input() data?: any;

  @Output() itemClicked = new EventEmitter<{data: any, index?: number, event: Event}>();

  sub: Subscription;

  constructor(
    public configService: ConfigService,
    public dragDropService: DragDropService,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sub = this.configService.watchConfig(this.id).subscribe((id) => {
      this.cdr.markForCheck(); // necessary to apply config changes
    });
  }

  ngAfterContentInit() {
    this.children.forEach(
      (tpl) => (this.templates[tpl.templateName] = tpl)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get isArray(): boolean {
    return Array.isArray(this.data);
  }

  onDndDrop(event: DndDropEvent) {
    console.log('dropped', event);
    if(typeof event.index === 'number') {
      this.dragDropService.handleDrop(
        this.id,
        event.index,
        event.data
      );
    }
  }

  onItemClicked(event: Event, data?: any, index?: number) {
    this.itemClicked.next({data, index, event});
  }
}
