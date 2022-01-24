import {
  ComponentRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
ComponentConfig,
  ConfigService,
  ContainerConfig,
} from '../configuration/config.service';
import { CodeGenerationService } from './code-generation.service';

@Directive({
  selector: '[uib-code]',
})
export class CodeDirective implements OnInit, OnDestroy {
  @Input('uib-code') id: string;
  @Input() data: any;

  componentRef?: ComponentRef<any>;

  sub: Subscription;

  constructor(
    public vcRef: ViewContainerRef,
    public configService: ConfigService,
    public codeGenerationService: CodeGenerationService
  ) {}

  ngOnInit() {
    this.sub = this.configService.watchConfig(this.id).subscribe((config) => {
      this.updateTemplate(config);
    });
    this.updateTemplate(this.configService.getConfig(this.id));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.componentRef?.destroy();
  }

  // Dynamic components

  updateTemplate(config: ComponentConfig) {
    this.componentRef?.destroy();
    this.componentRef = this.codeGenerationService.makeComponent(
      this.vcRef,
      config as ContainerConfig,
      this.data
    );
  }
}
