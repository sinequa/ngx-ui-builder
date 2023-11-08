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
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ConditionsService } from '../../conditions/conditions.service';
import { ComponentConfig, ConfigService } from '../../configuration';
import { ZoneContextService } from '../zone/zone-context.service';
import { ContainerIndex, DragDropService } from '../drag-drop.service';
import { TooltipDirective } from '../../utils';
import { ConfigurableDirective } from '../../configurable';
import { DndDropEvent, DndModule } from 'ngx-drag-drop';

@Component({
  selector: '[uib-item]',
  standalone: true,
  imports: [CommonModule, TooltipDirective, ConfigurableDirective, DndModule],
  templateUrl: './item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * id's element
   */
  @Input('uib-item') id: string;
  @Input() parentId: string;

  /**
   * index of element displayed when data is an Array
   */
  @Input() dataIndex?: number;

  /**
   * Is the component configurable
   */
  @Input() configurable: boolean = true;

  @HostBinding('class')
  classes?: string;


  // zone's conext informations
  /**
   * zone's name/id
   */
   zone: string;

  /**
   * used to store the configuration object for the component.
   */
  config: ComponentConfig;
  /**
   * used to determine if the component should be displayed or not.
   */
  condition = true;
  _data: any;

  private subscription = new Subscription();

  /**
   * used to determine if the flex direction is horizontal or not.
   * Always `false` when the component's type is not `_container`
   */
  isHorizontal: boolean = false;

  constructor(
    public zoneRef: ZoneContextService,
    public configService: ConfigService,
    public conditionsService: ConditionsService,
    public dragDropService: DragDropService,
    public cdr: ChangeDetectorRef,
    public el: ElementRef<HTMLElement>
  ) {
    // retrieve all zone's available informations
    this.zone = this.zoneRef.id;

    this.subscription.add(
      this.zoneRef.changes$.subscribe(({ data, conditionsData }) => {
        this.updateData();
        this.updateCondition();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.dataIndex) {
      this.updateData();
      this.updateCondition();
    }
  }

  ngOnInit() {
    const configChanges$ = this.configService.watchConfig(this.id).subscribe((config) => this.updateConfig(config));
    const allConfigChanges$ = this.configService.watchAllConfig().subscribe(() => this.cdr.markForCheck());

    this.subscription.add(configChanges$);
    this.subscription.add(allConfigChanges$);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // updates

  /**
   * It updates the component's configuration and condition, and sets the classes
   * for the component
   * @param {ComponentConfig} config - ComponentConfig - the configuration object
   * for the component
   */
  private updateConfig(config: ComponentConfig) {
    this.config = config;
    this.updateCondition();
    this.classes = this.config.classes || '';
    if (config.type === '_container') {
      this.classes += ' uib-container';
      if (this.configurable) {
        this.classes += ' uib-dropzone-content';
      }
    }
    if(!this.condition && !this.configurable) {
      this.classes += ' d-none'; // hide component unless in edit mode
    }
    this.isHorizontal = this.horizontal();
  }

  /**
   * If the dataIndex property is undefined, then the data property is assigned to
   * the `_data` property.
   *
   * Otherwise, the data property is indexed by the dataIndex
   * property and the result is assigned to the _data property
   */
  private updateData() {
    this._data = typeof this.dataIndex === 'undefined'? this.zoneRef.data : this.zoneRef.data[this.dataIndex];
  }

  /**
   * If the condition is not null, then check the condition and update the
   * condition variable
   */
  private updateCondition() {
    this.condition = this.conditionsService.check(this.config?.condition, this.zoneRef.conditionsData, this._data);
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

  /**
   * * If the element has a class of flex-column, it's not horizontal.
   * * If it has a class of d-flex or uib-dropzone, it's horizontal.
   * * If it has a style of display: flex, it's horizontal.
   *
   * Otherwise, it's not horizontal
   * @returns A boolean value.
   */
  private horizontal(): boolean {
    if(this.config.classes?.includes('flex-column')) {
      return false;
    }
    if (this.config.classes?.includes('d-flex') || this.config.classes?.includes('uib-dropzone') || this.el.nativeElement.style.display === "flex") {
      return true;
    }
    return false;
  }

  getItemTooltip(id: string): string {
    const config = this.configService.getConfig(id);
    return config.display || id;
  }
}
