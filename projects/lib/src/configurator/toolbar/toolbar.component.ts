import { ChangeDetectionStrategy, Component } from "@angular/core";

import { CommonModule } from "@angular/common";
import { ConfigurableService } from "../../configurable";
import { ConfigService } from "../../configuration";
import { TooltipDirective } from "../../utils";
import { SvgIconComponent } from "../../utils/svg-icon/svg-icon.component";

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

  constructor(
    public configService: ConfigService,
    public configurableService: ConfigurableService
  ) {}

  toggleEditor() {
    this.configurableService.toggleEditor();
  }

}