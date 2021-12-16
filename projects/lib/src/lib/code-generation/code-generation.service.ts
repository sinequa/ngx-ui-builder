import { CommonModule } from '@angular/common';
import {
  Compiler,
  Component,
  ComponentFactory,
  ComponentRef,
  Injectable,
  ModuleWithComponentFactories,
  NgModule,
  Type,
  ViewContainerRef,
} from '@angular/core';
import {
  ComponentConfig,
  ConfigService,
  ContainerConfig,
} from '../configuration/config.service';
import { Template } from './template.component';

@Injectable({ providedIn: 'root' })
export class CodeGenerationService {
  factoryCache = new Map<string, ComponentFactory<any>>();

  constructor(public compiler: Compiler, public configService: ConfigService) {}

  async makeComponentFactory(
    template: string,
    modules: any[] = [CommonModule],
    styles?: string[],
    cmpClass: Type<any> = Template
  ): Promise<ComponentFactory<any> | undefined> {
    // The component might exist already in the cache
    const tpl = this.factoryCache.get(template);
    if (tpl) {
      return tpl;
    }

    const templateComponent = Component({
      selector: '[uib-dynamic-template]',
      template,
      styles,
    })(cmpClass);

    const templateModule = NgModule({
      imports: modules,
      declarations: [templateComponent],
    })(class {});

    this.compiler.clearCache();
    // Note: both try-catch are necessary as the method below is partly synchronous
    try {
      return this.compiler
        .compileModuleAndAllComponentsAsync(templateModule)
        .then((factories: ModuleWithComponentFactories<any>) => {
          this.factoryCache.set(template, factories.componentFactories[0]);
          return this.factoryCache.get(template);
        });
    } catch (err) {
      return Promise.reject();
    }
  }

  makeComponent(
    vcRef: ViewContainerRef,
    config: ContainerConfig,
    data: any
  ): ComponentRef<Template> | undefined {
    if (config.template) {
      const factory = this.factoryCache.get(config.template);
      if (factory) {
        const comp = vcRef.createComponent<Template>(factory);
        comp.instance.data = data;
        comp.instance.classes = config.classes;
        comp.instance.id = config.id;
        comp.hostView.detectChanges(); // Prevent "changed after checked" errors
        return comp;
      }
    }
    return undefined;
  }

  generateCode(
    config: ContainerConfig,
    factory?: Record<string, (config: any) => string>
  ): string {
    if (config.template) return config.template;
    return config.items
      .map((id) => this.configService.getConfig(id))
      .map((config) => this.itemFactory(config, factory))
      .join('\n');
  }

  itemFactory(
    config: ContainerConfig | ComponentConfig,
    factory?: Record<string, (config: any) => string>
  ): string {
    let code;
    if (config.type === 'container') {
      code = this.generateCode(config as ContainerConfig, factory);
    } else {
      code =
        factory?.[config.type]?.(config) ||
        `<!-- No factory for type '${config.type}' -->`;
    }
    return [
      config.classes ? `<div class="${config.classes}">` : '<div>',
      '  ' + code.replace(/\n/g, '\n  '),
      `</div>`,
    ].join('\n');
  }
}
