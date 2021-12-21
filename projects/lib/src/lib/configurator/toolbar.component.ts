import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ConfigService } from "../configuration";

@Component({
  selector: 'uib-toolbar',
  template: `
<div class="btn-group">
  <button class="btn btn-primary" (click)="configService.undo()" [disabled]="!(configService.canUndo$()| async)">Undo</button>
  <button class="btn btn-primary" (click)="configService.redo()" [disabled]="!(configService.canRedo$()| async)">Redo</button>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {

  constructor(
    public configService: ConfigService
  ){}

}