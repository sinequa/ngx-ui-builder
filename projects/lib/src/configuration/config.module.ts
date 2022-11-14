import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { uibConfig } from "./config.reducer";

@NgModule({imports: [StoreModule.forFeature(uibConfig)]})
export class ConfigModule {}
