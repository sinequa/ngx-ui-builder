import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from './environments/environment';
import { AppComponent } from "./app/app.component";
import { StoreModule } from '@ngrx/store';
import { ConfigModule, SvgIconsModule, icons } from '@sinequa/ngx-ui-builder';
import { provideHttpClient } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom([
      SvgIconsModule.forRoot({icons: icons}),
      StoreModule.forRoot({}),
      ConfigModule
    ])
  ]
})
