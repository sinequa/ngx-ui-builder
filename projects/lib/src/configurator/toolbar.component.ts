import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ConfigurableService } from "../configurable";
import { ConfigService } from "../configuration";

@Component({
  selector: 'uib-toolbar',
  template: `
<div class="btn-group uib-toolbar uib-toolbar-anim" *ngIf="{enabled: configurableService.editorEnabled$ | async} as editor" >
  <ng-container *ngIf="editor.enabled">
    <button class="btn btn-primary" (click)="configService.undo()" [disabled]="!(configService.canUndo$()| async)" uib-tooltip="Undo" placement="top">
      <svg-icon key="undo"></svg-icon>
    </button>
    <button class="btn btn-primary" (click)="configService.redo()" [disabled]="!(configService.canRedo$()| async)" uib-tooltip="Redo" placement="top">
      <svg-icon key="redo"></svg-icon>
    </button>
    <ng-content></ng-content>
  </ng-container>
  <button class="btn bg-warning" (click)="toggleEditor()">
    <svg-icon *ngIf="editor.enabled" key="eye_slash"></svg-icon>
    <svg-icon *ngIf="!editor.enabled" key="eye"></svg-icon>
  </button>
</div>
  `,
  styles: [
    `
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