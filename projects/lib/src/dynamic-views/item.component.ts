import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { Subscription } from 'rxjs';
import { ConditionsService } from '../conditions/conditions.service';
import { ComponentConfig, ConfigService } from '../configuration/config.service';
import { TemplateNameDirective } from '../utils';
import { ContainerIndex, DragDropService } from './drag-drop.service';

@Component({
  selector: 'uib-item, [uib-item]',
  templateUrl: './item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['item.component.scss']
})
export class ItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input('uib-item') id: string;
  @Input() zone: string;
  @Input() data?: any;
  @Input() dataIndex?: number;
  @Input() conditionsData?: Record<string,any>;

  @Input() templates: Record<string, TemplateNameDirective>;

  @Input() configurable: boolean = true;

  @HostBinding('class')
  classes?: string;

  config: ComponentConfig;
  condition = true;

  subs: Subscription[] = [];

  _data: any;

  constructor(
    public configService: ConfigService,
    public conditionsService: ConditionsService,
    public dragDropService: DragDropService,
    public cdr: ChangeDetectorRef,
    public el: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.data || changes.dataIndex || changes.conditionsData) {
      this.updateData();
      this.updateCondition();
    }
  }

  ngOnInit() {
    const configChanges$ = this.configService.watchConfig(this.id).subscribe((config) => this.updateConfig(config));
    const allConfigChanges$ = this.configService.watchAllConfig().subscribe(() => this.cdr.markForCheck())

    this.subs.push(configChanges$, allConfigChanges$)
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  updateConfig(config: ComponentConfig) {
    this.config = config;
    if (config.type === '_container') {
      this.el.nativeElement.style.display = 'flex';
    }
    this.classes = this.config.classes;
    this.updateCondition();
  }

  updateData() {
    this._data = typeof this.dataIndex === 'undefined'? this.data : this.data[this.dataIndex];
  }

  updateCondition() {
    this.condition = this.conditionsService.check(this.config?.condition, this.conditionsData, this._data);
  }

  // Drag & Drop

  onDndDrop(event: DndDropEvent) {
    const dropped: string | ContainerIndex = (typeof event.data === 'string')
      ? event.data
      : { container: event.data.container, index: event.data.index }

    if(typeof event.index === 'number') {
      this.dragDropService.handleDrop(this.id, event.index, dropped);
    }
  }

  onDndCanceled(item: string, index: number) {
    console.log('cancelled', item, this.id);
    this.dragDropService.handleCancel(index, this.id);
  }

  isContainer(id: string) {
    return this.configService.isContainer(id);
  }

  isHorizontal() {
    if(this.config.classes?.includes('flex-column')) {
      return false;
    }
    if (this.config.classes?.includes('d-flex') || this.el.nativeElement.style.display === "flex") {
      return true;
    }
    return false;
  }

  child(item: string) {
    return this.configService.getConfig(item);
  }
}
