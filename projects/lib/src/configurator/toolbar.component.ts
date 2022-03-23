import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ConfigurableService } from "../configurable";
import { ConfigService } from "../configuration";

@Component({
  selector: 'uib-toolbar',
  template: `
<div class="btn-group uib-toolbar-anim" *ngIf="{enabled: configurableService.editorEnabled$ | async} as editor" >
  <button class="btn bg-warning" (click)="toggleEditor()">
    <span *ngIf="editor.enabled" class="fa-stack">
      <i class="fas fa-pen fa-stack-1x"></i>
      <i class="fas fa-ban fa-stack-2x"></i>
    </span>
    <i *ngIf="!editor.enabled" class="fas fa-pen"></i>
  </button>
  <ng-container *ngIf="editor.enabled">
    <button class="btn btn-primary" (click)="configService.undo()" [disabled]="!(configService.canUndo$()| async)" uib-tooltip="Undo" placement="top">
      <svg-icon key="undo" width="22px" height="25px"></svg-icon>
    </button>
    <button class="btn btn-primary" (click)="configService.redo()" [disabled]="!(configService.canRedo$()| async)" uib-tooltip="Redo" placement="top">
      <svg-icon key="redo" width="22px" height="25px"></svg-icon>
    </button>
  <ng-content></ng-content>
  </ng-container>
</div>
  `,
  styles: [
    `
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