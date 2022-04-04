import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Offcanvas } from 'bootstrap';
import { switchMap, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Configurable, ConfigurableService } from '../configurable/configurable.service';
import { ComponentConfig, ConfigService, ContainerConfig } from '../configuration/config.service';
import { Mutable } from '../utils/types.helpers';
import { TemplateNameDirective } from '../utils/template-name.directive';
import { defaultPaletteOptions } from './palette/palette.component';
import { ConfiguratorContext, ConfiguratorOptions } from './configurator.models';

export const defaultConfiguratorOptions: ConfiguratorOptions = {
  paletteOptions: defaultPaletteOptions,
  showFlexEditor: true,
  showHtmlEditor: true,
  showCssClasses: true,
  showConditionalDisplay: true,
  showRemove: true,
  showDuplicate: true
}

@Component({
  selector: 'uib-configurator',
  templateUrl: './configurator.component.html',
  styles:[`
.offcanvas-body {
  padding-bottom: 90px; // avoid toolbar hiding bottom of configurator
}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorComponent implements OnInit {
  // Capture configurator templates
  @ContentChildren(TemplateNameDirective)
  children: QueryList<TemplateNameDirective>;
  configurators: Record<string, TemplateNameDirective> = {};

  @ViewChild('offcanvas') offcanvasEl: ElementRef;
  offcanvas: Offcanvas;

  @ViewChild('offcanvasBody') offcanvasBodyEl: ElementRef;

  @Input() options = defaultConfiguratorOptions;
  @Input() zoneOptions: Record<string, ConfiguratorOptions> = {};

  edited$: Observable<ConfiguratorContext>;
  
  configuration: ComponentConfig[] = [];

  _showTree: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    public configurableService: ConfigurableService,
    public configService: ConfigService
  ) {}

  ngOnInit(): void {
      
    this.edited$ = this.configurableService.watchEdited().pipe(
      tap(() => this.offcanvas.show()),
      tap(() => this.showTree(false)),
      switchMap((context) => 
        this.configService.watchConfig(context!.id).pipe(
          map(config => ({
            context,
            config,
            options: this.resolveOptions(context.zone),
            configurators: this.configurators,
            configChanged: () => this.configService.updateConfig(config)
          }))
        )
      )
    );
    
    // subscribe to configuration events
    this.configService.watchAllConfig().subscribe(config => {
      this.configuration = config;
      this.cdr.markForCheck();
    });
    
    // when edition is disabled, close side panel
    this.configurableService.editorEnabled$.subscribe(value => {
      if (value === false && this.offcanvas) {
        this.offcanvas.hide();
      }
    });
  }

  /**
   * Create Bootstrap OffCanvas component
   */
  ngAfterViewInit() {
    this.offcanvas = Offcanvas.getOrCreateInstance(this.offcanvasEl.nativeElement, {
      backdrop: false,
      scroll: true
    });
    this.offcanvasEl.nativeElement.addEventListener('hide.bs.offcanvas', _ => {
      this.configurableService.stopEditing();
    });
  }

  /**
   * Extract list of configuration editors
   */
  ngAfterContentInit() {
    this.children.forEach(
      tpl => (this.configurators[tpl.templateName] = tpl)
    );
  }
  
  showTree(showTree = true) {
    this._showTree = showTree;
    this.offcanvasBodyEl.nativeElement.scroll(0, 0);
  }

  resolveOptions(zone: string) {
    // First set defaults, then the configurator options, then zone-specific options
    const options = Object.assign({}, defaultConfiguratorOptions, this.options, this.zoneOptions[zone] || {});
    // Same thing for the nested palette options
    options.paletteOptions = Object.assign({}, defaultPaletteOptions, this.options.paletteOptions, this.zoneOptions[zone]?.paletteOptions || {});
    return options;
  }

  /**
   * It removes the item from the parent container.
   * @param {Event} event - Event
   */
  remove(context: Configurable) {    
    // only uib-zone cannot self remove
    if (context.parentId) {
      const container = this.configService.getContainer(context.parentId);
      const index = container.items.findIndex(item => item === context.id);
      if (index !== -1) {
        container.items.splice(index, 1);
        this.configService.updateConfig([container]);
        this.offcanvas.toggle();
      }
    }
  }

  duplicate(context: Configurable) {
    const config: Mutable<ComponentConfig> = this.configService.getConfig(context.id);
    config.id = this.configService.generateId(config.id); // Generate a new config id
    if(context.parentId) {
      const container = this.configService.getContainer(context.parentId);
      const index = container.items.findIndex(item => item === context.id);
      if (index !== -1) {
        container.items.splice(index+1, 0, config.id);
        this.configService.updateConfig([config, container]);
      }
    }
    // Special case of a zone
    else if(context.zone === context.id) {
      // Create another copy
      const config2: Mutable<ComponentConfig> = this.configService.getConfig(context.id);
      config2.id = this.configService.generateId(config.id);
      
      const container: ContainerConfig = {
        id: context.id,
        type: '_container',
        items: [config.id, config2.id],
        classes: "flex-column",
      };

      this.configService.updateConfig([config, config2, container]);
    }
  }
}
