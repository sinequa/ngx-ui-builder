import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { uibReducer } from "./config.reducer";

@NgModule({imports: [StoreModule.forRoot(uibReducer)]})
export class ConfigModule {}
