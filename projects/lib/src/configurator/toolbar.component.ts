import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef } from "@angular/core";
import { ConfigurableService } from "../configurable";
import { ConfigService } from "../configuration";

@Component({
  selector: 'uib-toolbar',
  template: `
<div class="btn-group uib-toolbar uib-toolbar-anim" *ngIf="{enabled: configurableService.editorEnabled$ | async} as editor" >
  <ng-container *ngIf="editor.enabled">
    <ng-container [ngTemplateOutlet]="template"></ng-container>
    <button class="btn btn-primary" (click)="configService.undo()" [ngClass]="{'disabled': !(configService.canUndo$()| async)}" uib-tooltip="Undo" placement="top">
      <svg-icon key="undo"></svg-icon>
    </button>
    <button class="btn btn-primary" (click)="configService.redo()" [ngClass]="{'disabled': !(configService.canRedo$()| async)}" uib-tooltip="Redo" placement="top">
      <svg-icon key="redo"></svg-icon>
    </button>
  </ng-container>
  <button class="btn bg-warning" (click)="toggleEditor()" uib-tooltip="Enable/Disable UI-Editor">
    <svg-icon key="{{editor.enabled ? 'eye_slash' : 'eye' }}"></svg-icon>
  </button>
</div>
  `,
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