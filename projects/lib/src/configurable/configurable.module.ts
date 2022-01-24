import { CommonModule } from "@angular/common";
import {NgModule} from "@angular/core";

import { ConfigurableDirective } from "./configurable.directive";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ConfigurableDirective
    ],
    exports: [
        ConfigurableDirective
    ]
})
export class ConfigurableModule {}