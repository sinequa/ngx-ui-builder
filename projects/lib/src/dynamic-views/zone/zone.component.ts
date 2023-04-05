import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ContentChildren,
  Input,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ConfigService } from '../../configuration/config.service';
import { ConfigurableDirective, ConfigurableService } from '../../configurable';
import { ZoneContextService } from './zone-context.service';
import { TemplateNameDirective } from '../../utils';
import { CommonModule } from '@angular/common';
import { ItemComponent } from '../public-api';


@Component({
  selector: 'uib-zone',
  standalone: true,
  imports: [CommonModule, ConfigurableDirective, ItemComponent],
  templateUrl: './zone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ZoneContextService]
})
export class ZoneComponent implements OnInit, OnDestroy {
  @ContentChildren(TemplateNameDirective)
  children: QueryList<TemplateNameDirective>;

  /**
   * zone's id
   */
  @Input() id: string;
  /**
   * additional template's data. If data is an array, an *ngFor will be done using
   * each data's items
   */
  @Input() data?: any;
  /**
   * conditional display rules
   */
  @Input() conditionsData?: Record<string, unknown>;

  /**
   * Emit an event when a zone's element is clicked
   * sending it's index and additional data
   */
  @Output()
  itemClicked = new EventEmitter<{data: any, index?: number, event: Event}>();

  /**
   * return `true` when edit mode is enabled
   */
  enabled$: BehaviorSubject<boolean>;

  private subscription = new Subscription();

  constructor(
    public readonly zoneContext: ZoneContextService,
    public readonly configService: ConfigService,
    public readonly configurableService: ConfigurableService,
    public readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.zoneContext.id = this.id;
    this.enabled$ = this.configurableService.editorEnabled$

    this.subscription.add(
      this.configService
        .watchConfig(this.id)
        .subscribe(() => {
          this.cdr.markForCheck(); // necessary to apply config changes
        })
    );
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.zoneContext.update({data: this.data, conditionsData: this.conditionsData});
  }

  ngAfterContentInit() {
    this.children.forEach(
      (template) => (this.zoneContext.templates[template.name] = template)
    );
  }

  get isArray(): boolean {
    return Array.isArray(this.zoneContext.data);
  }

  /**
   * Propagate the element's click event
   *
   * If the index is undefined, then data is the data object, otherwise data is the
   * data object's index
   * @param {Event} event - The event that triggered the click.
   * @param {any} [data] - The data object that was clicked.
   * @param {number} [index] - The index of the item in the list.
   */
  onItemClicked(event: Event, data?: any, index?: number) {
    data = typeof index === 'undefined'? data : data[index];
    this.itemClicked.next({data, index, event});
  }
}
