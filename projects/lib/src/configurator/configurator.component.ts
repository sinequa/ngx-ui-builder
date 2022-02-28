import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Offcanvas } from 'bootstrap';
import { switchMap, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Configurable, ConfigurableService } from '../configurable/configurable.service';
import { ComponentConfig, ConfigService, ContainerConfig } from '../configuration/config.service';
import { TemplateNameDirective } from '../utils/template-name.directive';

export interface ConfiguratorContext {
  /** Object storing the configuration of the component */
  config: ComponentConfig;
  /** Register of all the components configurators  */
  configurators?: Record<string, TemplateNameDirective>;
  /** Context of the zone of the edited component */
  context?: Configurable;
  /** Callback that the configurator should call to update the configuration */
  configChanged: () => void;
};

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
export class ConfiguratorComponent {
  // Capture configurator templates
  @ContentChildren(TemplateNameDirective)
  children: QueryList<TemplateNameDirective>;
  configurators: Record<string, TemplateNameDirective> = {};

  @ViewChild('offcanvas') offcanvasEl: ElementRef;
  offcanvas: Offcanvas;

  @ViewChild('offcanvasBody') offcanvasBodyEl: ElementRef;

  @Input() showPalette = true;
  @Input() showFlexEditor = true;
  @Input() showHtmlEditor = true;
  @Input() showCssClasses = true;
  @Input() showConditionalDisplay = true;
  @Input() showRemove = true;
  @Input() showDuplicate = true;

  edited$: Observable<ConfiguratorContext>;
  
  configuration: ComponentConfig[] = [];

  _showTree: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    public configurableService: ConfigurableService,
    public configService: ConfigService
  ) {
    
    this.edited$ = configurableService.watchEdited().pipe(
      tap(() => this.offcanvas.show()),
      tap(() => this.showTree(false)),
      switchMap((context) => 
        configService.watchConfig(context!.id).pipe(
          map(config => ({
            context,
            config,
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
    const config = this.configService.getConfig(context.id);
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
      const config2 = this.configService.getConfig(context.id);
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
