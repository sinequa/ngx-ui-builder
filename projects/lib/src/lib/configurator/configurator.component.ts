import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { switchMap, Observable, map } from 'rxjs';
import { Configurable, ConfigurableService } from '../configurable/configurable.service';
import { ComponentConfig, ConfigService } from '../configuration/config.service';
import { TemplateNameDirective } from '../template-name/template-name.directive';

@Component({
  selector: 'uib-configurator',
  templateUrl: './configurator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorComponent {
  // Capture configurator templates
  @ContentChildren(TemplateNameDirective)
  children: QueryList<TemplateNameDirective>;
  templates: Record<string, TemplateRef<any>> = {};

  edited$: Observable<{context: Configurable, config: ComponentConfig}>;

  constructor(
    public configurableService: ConfigurableService,
    public configService: ConfigService
  ) {
    this.edited$ = configurableService.edited$.pipe(
      switchMap((context) => 
        configService.watchConfig(context.id).pipe(
          map(config => ({context, config}))
        )
      )
    );
  }

  /**
   * Extract list of configuration editors
   */
  ngAfterContentInit() {
    this.children.forEach(
      (instance) => (this.templates[instance.templateName] = instance.template)
    );
  }
}
