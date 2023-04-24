import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { Configurable } from '../../configurable/configurable.service';
import { ComponentConfig, ConfigService } from '../../configuration';
import { ComponentCreator, DragDropService } from '../../dynamic-views/drag-drop.service';
import { ModalComponent, SvgIconComponent, TemplateNameDirective, TooltipDirective } from '../../utils';
import { PaletteOptions } from '../configurator.models';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ngx-drag-drop';

declare interface PaletteItem extends ComponentCreator {
  type: string;
  display?: string;
  iconClass?: string;
  title?: string;
  removable?: boolean;
  createConfig: (id: string, creator?: ComponentCreator) => Observable<ComponentConfig|undefined>;
}

declare interface ConfigModal {
  configurator: TemplateNameDirective;
  config: ComponentConfig;
  configChanged: () => void;
  title: string;
  close: Subject<ComponentConfig|undefined>;
}

export const defaultPaletteOptions: PaletteOptions = {
  enableSubcontainers: true,
  enableRawHtml: true,
  rawHtmlPlaceholder: "<h1>Edit me</h1>",
  showStandardPalette: true,
  showExistingPalette: true
};

@Component({
  selector: 'uib-palette',
  standalone: true,
  imports: [CommonModule, DndModule, TooltipDirective, SvgIconComponent, ModalComponent],
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaletteComponent implements OnInit, OnChanges, OnDestroy {
  @Input() context: Configurable;
  @Input() configurators: Record<string,TemplateNameDirective> = {};
  @Input() options = defaultPaletteOptions;

  standardPalette: PaletteItem[];
  existingPalette: PaletteItem[];

  modal?: ConfigModal;

  constructor(
    public dragDropService: DragDropService,
    public configService: ConfigService,
    public cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // The palette of existing components is constructed from the complete configuration
    this.sub = this.configService.watchAllConfig()
      .subscribe(configs => {
        this.generateExistingPalette(configs)
        this.cdRef.markForCheck();
      });
  }

  ngOnChanges() {
    // Initialize options with default, then custom
    this.options = Object.assign({}, defaultPaletteOptions, this.options);
    this.generateAutoPalette();
    // The existing palette must be update when the standard palette changes
    this.generateExistingPalette(this.configService.getAllConfig());
  }

  sub: Subscription;
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  generateAutoPalette() {
    this.standardPalette = [];
    if(!this.options.showStandardPalette) {
      return;
    }
    if (this.options.enableSubcontainers) {
      this.standardPalette.push({
        type: '_container',
        display: $localize `Container`,
        title: $localize `A component to arrange various sub-components`,
        createConfig: (id: string) => of({ type: '_container', id, items: [] }),
      });
    }
    if (this.options.enableRawHtml) {
      this.standardPalette.push({
        type: '_raw-html',
        display: $localize `Raw HTML`,
        title: $localize `A component to write HTML freely`,
        createConfig: (id: string) => of({ type: '_raw-html', id, rawHtml: this.options.rawHtmlPlaceholder})
      })
    }
    if (this.context.templates) {
      Object.keys(this.context.templates).forEach((type) => {
        let template = this.context.templates![type];
        this.standardPalette.push({
          type,
          display: template.display || type,
          iconClass: template.iconClass,
          title: template.description,
          createConfig: (id: string) => this.openModal(id, type, this.configurators[type]),
        });
      });
    }
  }

  generateExistingPalette(configs: ComponentConfig[]) {
    if(!this.options.showExistingPalette) {
      this.existingPalette = [];
      return;
    }
    this.existingPalette = configs.filter(c =>
      // Add any non-container config whose type is compatible with the standard palette
      this.standardPalette
        .find(p => p.type !== '_container' && p.type === c.type))
        .map(c => ({
          type: c.type,
          display: c.id,
          title: $localize `Type: ${this.context.templates?.[c.type]?.display || c.type}`,
          removable: !this.configService.isUsed(c.id),
          createConfig: _ => of(c) // The config already exists
        })
    )
  }

  onDndStart(item: PaletteItem) {
    this.dragDropService.draggedCreator = item;
  }

  onDndEnd() {
    this.dragDropService.draggedCreator = undefined;
  }

  openModal(id: string, type: string, configurator?: TemplateNameDirective): Observable<ComponentConfig|undefined> {
    const config = {type, id};
    if(configurator) {
      this.modal = {
        configurator,
        config,
        configChanged: () => {}, // do nothing when the configurator changes the config (before user presses 'OK')
        title: $localize `Create new ${type} component`,
        close: new Subject<ComponentConfig|undefined>()
      }
      return this.modal.close;
    }
    return of(config);
  }

  onModalClose(success: boolean) {
    if(this.modal?.close) {
      this.modal.close.next(success? this.modal.config : undefined);
      this.modal.close.complete();
      this.modal = undefined;
    }
  }

  removeItem(item: PaletteItem) {
    console.log("remove", item);
    this.configService.removeConfig(item.display!); // The display is the component id
  }
}
