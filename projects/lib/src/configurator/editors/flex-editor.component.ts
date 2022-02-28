import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentConfig, ConfigService } from '../../configuration';

declare interface FlexOption {
  key: string;
  text: string;
  value: string;
  bootstrap: string;
}

@Component({
  selector: 'uib-flex-editor',
  templateUrl: 'flex-editor.component.html',
  styleUrls: ['./flex-editor.component.scss'],
})
export class FlexEditorComponent implements OnChanges {
  @Input() config: ComponentConfig;
  
  // tooltip's placement
  placement = "bottom";
  
  classes: string[];

  get direction(): 'row' | 'column' {
    return this.classes.includes('flex-column') ? 'column' : 'row';
  }
    
  directions: FlexOption[] = [
    {key: 'arrow_down', text: 'vertical', value: 'column', bootstrap: 'flex-column'},
    {key: 'arrow_forward', text: 'horizontal', value: 'row', bootstrap: 'flex-row'}
  ]
  
  justify: FlexOption[] = [
    {key:'align_x_start', text: 'start', value: 'flex-start', bootstrap: 'justify-content-start'},
    {key:'align_x_center', text: 'center', value: 'center', bootstrap: 'justify-content-center'},
    {key:'align_x_end', text: 'end', value: 'flex-end', bootstrap: 'justify-content-end'},
    {key:'align_x_space_around', text: 'space around', value: 'space-around', bootstrap: 'justify-content-around'},
    {key:'align_x_space_between', text: 'space between', value: 'space-between', bootstrap: 'justify-content-between'}
  ]
  
  alignmentHorizontal: FlexOption[] = [
    {key: 'align_y_start', text: 'top', value: 'flex-start', bootstrap: 'align-items-start'},
    {key: 'align_y_center', text: 'center', value: 'center', bootstrap: 'align-items-center'},
    {key: 'align_y_end', text: 'bottom', value: 'flex-end', bootstrap: 'align-items-end'},
    {key: 'align_y_stretch', text: 'stretch', value: 'stretch', bootstrap: 'align-items-stretch'},
    {key: 'align_y_baseline', text: 'baseline', value: 'baseline', bootstrap: 'align-items-baseline'},
  ]
  
  alignmentVertical: FlexOption[] = [
    {key:'align_x_start', text: 'start', value: 'flex-start', bootstrap: 'align-items-start'},
    {key:'align_x_center', text: 'center', value: 'center', bootstrap: 'align-items-center'},
    {key:'align_x_end', text: 'end', value: 'flex-end', bootstrap: 'align-items-end'},
    {key:'align_x_stretch', text: 'stretch', value: 'stretch', bootstrap: 'align-items-stretch'},
  ]

  get alignment(): FlexOption[] {
    return this.direction === 'column'? this.alignmentVertical : this.alignmentHorizontal;
  }
  
  
  constructor(
    public configService: ConfigService
  ) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config) {
      // convert "classes" string into array
      this.classes = this.config.classes?.split(' ') || [];
    }
  }

  updateConfig() {
    this.config.classes = this.classes.join(' ');
    this.configService.updateConfig(this.config);
  }

  toggleClass(style: string, turnOff: FlexOption[] = []) {
    const i = this.classes.indexOf(style);
    // Remove all classes matching a flex option
    this.classes = this.classes.filter(c => c !== style && !turnOff.find(o => o.bootstrap === c));
    // Then add the class, unless it was already there (in which case, the filter turned it off)
    if(i === -1) {
      this.classes.push(style);
    }
    this.updateConfig();
  }
}
