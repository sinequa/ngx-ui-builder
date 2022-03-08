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
import { ConditionsService } from '../configuration';
import { ComponentConfig, ConfigService } from '../configuration/config.service';
import { TemplateNameDirective } from '../utils';
import { DragDropService } from './drag-drop.service';

@Component({
  selector: '[uib-item]',
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

  constructor(
    public configService: ConfigService,
    public conditionsService: ConditionsService,
    public dragDropService: DragDropService,
    public cdr: ChangeDetectorRef,
    public el: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.data) {
      this.updateCondition();
    }
  }

  ngOnInit() {
    const configChanges$ = this.configService.watchConfig(this.id).subscribe((config) => this.updateConfig(config));
    const allConfigChanges$ = this.configService.watchAllConfig().subscribe(() => this.cdr.markForCheck())
    
    this.subs.push(configChanges$, allConfigChanges$)
    this.updateConfig(this.configService.getConfig(this.id));
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  updateConfig(config: ComponentConfig) {
    this.config = config;
    this.classes = this.config.classes;
    if(this.configService.isContainerConfig(config)) {
      this.classes = (this.classes || '') + ' uib-container';
    }
    this.updateCondition();
  }

  updateCondition() {
    this.condition = this.config?.condition? this.conditionsService.check(this.config.condition, this.conditionsData, this.data) : true;
  }

  // Drag & Drop

  onDndDrop(item: string, event: DndDropEvent) {
    console.log('dropped', event);
    if(typeof event.index === 'number') {
      this.dragDropService.handleDrop(item, event.index, event.data);
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
    if(this.el.nativeElement.classList.contains('d-flex')) {
      return !this.el.nativeElement.classList.contains('flex-column');
    }
    return false;
  }
}
