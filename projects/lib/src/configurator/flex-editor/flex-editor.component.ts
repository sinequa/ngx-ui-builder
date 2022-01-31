import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subject} from 'rxjs';
import { ComponentConfig } from '../../configuration';

@Component({
  selector: 'uib-flex-editor',
  templateUrl: 'flex-editor.component.html',
  styleUrls: ['./flex-editor.component.scss'],
})
export class FlexEditorComponent implements OnChanges {
  @Input() config: ComponentConfig;
  @Output() onChanges = new EventEmitter<any>();
  
  // tooltip's placement
  placement = "bottom";
  
  // current flexbox direction, by default is undefined
  direction: 'row' | 'column' | undefined;
  
  flex: Partial<{
    "display": string,
    "flex-direction": string,
    "row": string,
    "justify-content": string,
    "align-items": string
  }> = {}
  
  directions = [
    {key: 'arrow_down', text: 'vertical', value: 'column', bootstrap: 'flex-column'},
    {key: 'arrow_forward', text: 'horizontal', value: 'row', bootstrap: 'flex-row'}
  ]
  
  justify = [
    {key:'align_x_start', text: 'start', style: 'flex-start', bootstrap: 'justify-content-start'},
    {key:'align_x_center', text: 'center', style: 'center', bootstrap: 'justify-content-center'},
    {key:'align_x_end', text: 'end', style: 'flex-end', bootstrap: 'justify-content-end'},
    {key:'align_x_space_around', text: 'space around', style: 'space-around', bootstrap: 'justify-content-around'},
    {key:'align_x_space_between', text: 'space between', style: 'space-between', bootstrap: 'justify-content-between'}
  ]
  
  alignmentHorizontal = [
    {key: 'align_y_start', text: 'top', style: 'flex-start', bootstrap: 'align-items-start'},
    {key: 'align_y_center', text: 'center', style: 'center', bootstrap: 'align-items-center'},
    {key: 'align_y_end', text: 'bottom', style: 'flex-end', bootstrap: 'align-items-end'},
    {key: 'align_y_stretch', text: 'stretch', style: 'stretch', bootstrap: 'align-items-stretch'},
    {key: 'align_y_baseline', text: 'baseline', style: 'baseline', bootstrap: 'align-items-baseline'},
  ]
  
  alignmentVertical = [
    {key:'align_x_start', text: 'start', style: 'flex-start', bootstrap: 'align-items-start'},
    {key:'align_x_center', text: 'center', style: 'center', bootstrap: 'align-items-center'},
    {key:'align_x_end', text: 'end', style: 'flex-end', bootstrap: 'align-items-end'},
    {key:'align_x_stretch', text: 'stretch', style: 'stretch', bootstrap: 'align-items-stretch'},
  ]
  
  flex$ = new Subject();
  classes: string[];
  
  constructor() {
    this.flex$.subscribe((value: any) => {
      this.flex = {...this.flex, ...value};
      
      this.onChanges.emit(this.flex);
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config) {
      // convert "classes" string into array
      this.classes = ((changes.config.currentValue) as ComponentConfig).classes?.split(' ') || [];
      
      if (this.classes.length > 0) {
        this.direction = this.classes.includes('flex-column') ? 'column' : 'row';
        
        // set flex object
        this.flex.display = "d-flex";
        this.flex['flex-direction'] = this.direction === 'column' ? 'flex-column' : 'flex-row';
        this.flex['justify-content'] = this.classes.filter(item => item.startsWith("justify-"))[0] || undefined;
        this.flex['align-items'] = this.classes.filter(item => item.startsWith("align-items-"))[0] || undefined;
        
      } else {
        this.flex = {};
        this.direction = undefined;
      }
    }
  }

  flexDirection(direction: 'row' | 'column', style: string) {
    this.direction = direction;
    this.flex$.next({"display": 'd-flex', "flex-direction": style});
  }
  
  justifyContent(style: string) {
    this.flex$.next({"justify-content": style});
  }
  
  alignItems(style: string) {
    this.flex$.next({"align-items": style});
  }
}
