import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { Subscription } from 'rxjs';
import {
  ComponentConfig,
  ConfigService,
} from '../configuration/config.service';
import { DragDropService } from './drag-drop.service';

@Component({
  selector: '[uib-item]',
  templateUrl: './item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['item.component.scss']
})
export class ItemComponent implements OnInit, OnDestroy {
  @Input('uib-item') id: string;
  @Input() zone: string;
  @Input() data: any;
  @Input() dataIndex: number;
  @Input() templates: Record<string, TemplateRef<any>>;
  @Input() enableContainers = true;

  @HostBinding('class')
  classes?: string;

  config: ComponentConfig;

  subs: Subscription[] = [];

  constructor(
    public configService: ConfigService,
    public dragDropService: DragDropService,
    public cdr: ChangeDetectorRef,
    public element: ElementRef
  ) {}

  ngOnInit() {
    //console.log('subscribed to ', this.id);
    this.subs.push(
      this.configService.watchConfig(this.id).subscribe((config) => {
        this.updateConfig(config);
      })
    );
    this.subs.push(
      this.configService
        .watchAllConfig()
        .subscribe((_) => this.cdr.markForCheck())
    );
    this.updateConfig(this.configService.getConfig(this.id));
  }

  ngOnDestroy() {
    //console.log('destroyed sub to ', this.id);
    this.subs.forEach((s) => s.unsubscribe());
  }

  updateConfig(config: ComponentConfig) {
    this.config = config;
    this.classes = this.config.classes;
    if(this.configService.isContainerConfig(config)) {
      this.classes = (this.classes || '') + ' uib-container';
    }
  }

  // Drag & Drop

  onDndDrop(item: string, event: DndDropEvent) {
    console.log('dropped', event);
    if(typeof event.index === 'number') {
      this.dragDropService.handleDrop(item, event.index, event.data);
    }
  }

  isContainer(id: string) {
    return this.configService.isContainer(id);
  }

  isHorizontal() {
    if(this.element.nativeElement.classList.contains('d-flex')) {
      return !this.element.nativeElement.classList.contains('flex-column');
    }
    return false;
  }
}
