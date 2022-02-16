import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ConfigService } from "../configuration";

@Component({
  selector: 'uib-toolbar',
  template: `
<div class="btn-group">
  <button class="btn btn-primary" (click)="configService.undo()" [disabled]="!(configService.canUndo$()| async)" uib-tooltip="Undo" placement="top">
    <svg-icon key="undo" width="22px" height="25px"></svg-icon>
  </button>
  <button class="btn btn-primary" (click)="configService.redo()" [disabled]="!(configService.canRedo$()| async)" uib-tooltip="Redo" placement="top">
    <svg-icon key="redo" width="22px" height="25px"></svg-icon>
  </button>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {

  constructor(
    public configService: ConfigService
  ){}

}