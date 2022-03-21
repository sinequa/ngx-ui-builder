import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ConfigService } from "../configuration";

@Component({
  selector: 'uib-toolbar',
  template: `
<div class="btn-group">
  <button class="btn bg-warning" (click)="toggleEditor()">
    <span *ngIf="enabled" class="fa-stack">
      <i class="fas fa-pen fa-stack-1x"></i>
      <i class="fas fa-ban fa-stack-2x"></i>
    </span>
    <i *ngIf="!enabled" class="fas fa-pen"></i>
  </button>
  <ng-container *ngIf="enabled">
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnDestroy {
  
  private destroy$ = new Subject();
  enabled: boolean;
  
  constructor(
    public configService: ConfigService
  ) {
    this.configService.editorEnabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.enabled = value);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleEditor() {
    this.enabled = !this.enabled;
    this.configService.toggleEditor(this.enabled);
  }

}