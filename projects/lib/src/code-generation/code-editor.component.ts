import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { CodeGenerationService } from './code-generation.service';
import {
  ConfigService,
  ContainerConfig,
} from '../configuration/config.service';

@Component({
  selector: 'uib-code-editor',
  templateUrl: './code-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent implements OnChanges {
  @Input() config: ContainerConfig;
  @Input() codeFactory?: Record<string, (config: any) => string>;
  @Input() codeModules?: any[];

  templateCode: string;

  constructor(
    public configService: ConfigService,
    public codeGenerationService: CodeGenerationService
  ) {}

  ngOnChanges() {
    this.setTemplateCode();
  }

  // CODE GENERATION //
  /////////////////////

  setTemplateCode() {
    if (this.config.template) {
      this.templateCode = this.config.template;
    } else {
      this.templateCode = this.codeGenerationService.generateCode(
        this.config,
        this.codeFactory
      );
    }
  }

  convert() {
    this.codeGenerationService
      .makeComponentFactory(this.templateCode, this.codeModules)
      .then(() => {
        this.config.template = this.templateCode;
        this.configService.updateConfig(this.config);
      });
  }

  reset() {
    this.config.template = '';
    this.configService.updateConfig(this.config);
    this.setTemplateCode();
  }
}
