import { Component, OnInit } from '@angular/core';
import {
  ConfigurableService,
  ConfigService,
  ZoneComponent,
  ToolbarComponent,
  ConfiguratorComponent,
  ToastComponent,
  TemplateNameDirective,
  NgModelChangeDebouncedDirective,
  TooltipDirective,
  ComponentConfig
} from '@gsaas/ngx-ui-builder';
import { defaultConfig } from "./config";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {StyleClassModule} from 'primeng/styleclass';
import {PrimeNGConfig} from "primeng/api";
import {BadgeModule} from "primeng/badge";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    ZoneComponent,
    ToolbarComponent,
    ConfiguratorComponent,
    ToastComponent,
    TemplateNameDirective,
    NgModelChangeDebouncedDirective,
    TooltipDirective,

    ButtonModule,
    RippleModule,
    StyleClassModule,
    BadgeModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    public configService: ConfigService,
    public configurableService: ConfigurableService,
    private primengConfig: PrimeNGConfig) {
   // Enable ripple effect globally
    this.primengConfig.ripple = true;
  }

  ngOnInit() {
    // Initial state of the UI builder
    this.configService.init(this.getPageConfig());
  }

  save() {
    localStorage.setItem('config', this.configService.getAllConfiguration());
  }

  getPageConfig(): ComponentConfig[] {
    const localConfig = localStorage.getItem('config') ?? JSON.stringify(defaultConfig);
    return JSON.parse(localConfig) as ComponentConfig[];
  }


}
