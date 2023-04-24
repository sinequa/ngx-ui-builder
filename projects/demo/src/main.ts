import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from './environments/environment';
import { AppComponent } from "./app/app.component";
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { ConfigModule, SvgIconsModule, icons } from '@sinequa/ngx-ui-builder';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      HttpClientModule,
      SvgIconsModule.forRoot({icons: icons}),
      StoreModule.forRoot({}),
      ConfigModule
    ])
  ]
})
