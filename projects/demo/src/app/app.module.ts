import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DynamicViewsModule, ConfiguratorModule, ConditionsModule } from '@sinequa/ngx-ui-builder';
import { AppComponent } from './app.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,

    DynamicViewsModule,
    ConfiguratorModule,
    ConditionsModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
