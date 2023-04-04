import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from './environments/environment';
import { AppComponent } from "./app/app.component";
import { ConfiguratorModule } from '@sinequa/ngx-ui-builder';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      HttpClientModule,
      StoreModule.forRoot({}),
      ConfiguratorModule,
    ])
  ]
})
