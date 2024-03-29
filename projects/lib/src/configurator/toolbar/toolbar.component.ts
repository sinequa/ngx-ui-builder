import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef } from "@angular/core";

import { ConfigurableService } from "../../configurable";
import { ConfigService } from "../../configuration";
import { SvgIconComponent } from "../../utils/svg-icon/svg-icon.component";
import { CommonModule } from "@angular/common";
import { TooltipDirective } from "../../utils";

@Component({
  selector: 'uib-toolbar',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, TooltipDirective],
  templateUrl: './toolbar.component.html',
  styles: [
    `
    .uib-toolbar .btn.disabled {
      /* allow tooltip on disabled buttons */
      pointer-events: visible;
      /* but display a simple arrow cursor */
      cursor: default;
    }

    .uib-toolbar .btn svg-icon {
      display: flex;
      align-items: center;
      width: 22px;
      height: 25px;
    }
    .uib-toolbar-anim {
      transition: ease .3s;
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  @ContentChild(TemplateRef, {static: false}) template: TemplateRef<any>;

  constructor(
    public configService: ConfigService,
    public configurableService: ConfigurableService
  ) {}

  toggleEditor() {
    this.configurableService.toggleEditor();
  }

}