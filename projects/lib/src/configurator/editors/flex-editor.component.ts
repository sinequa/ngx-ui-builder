import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentConfig, ConfigService } from '../../configuration';
import { TooltipPlacement } from '../../utils';

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
  placement: TooltipPlacement = "bottom";
  
  classes: string[];

  get direction(): 'row' | 'column' {
    return this.classes.includes('flex-column') ? 'column' : 'row';
  }
    
  directions: FlexOption[] = [
    {key: 'arrow_down', text: $localize `vertical`, value: 'column', bootstrap: 'flex-column'},
    {key: 'arrow_forward', text: $localize `horizontal`, value: 'row', bootstrap: 'flex-row'}
  ]
  
  justify: FlexOption[] = [
    {key:'align_x_start', text: $localize `start`, value: 'flex-start', bootstrap: 'justify-content-start'},
    {key:'align_x_center', text: $localize `center`, value: 'center', bootstrap: 'justify-content-center'},
    {key:'align_x_end', text: $localize `end`, value: 'flex-end', bootstrap: 'justify-content-end'},
    {key:'align_x_space_around', text: $localize `space around`, value: 'space-around', bootstrap: 'justify-content-around'},
    {key:'align_x_space_between', text: $localize `space between`, value: 'space-between', bootstrap: 'justify-content-between'}
  ]
  
  alignmentHorizontal: FlexOption[] = [
    {key: 'align_y_start', text: $localize `top`, value: 'flex-start', bootstrap: 'align-items-start'},
    {key: 'align_y_center', text: $localize `center`, value: 'center', bootstrap: 'align-items-center'},
    {key: 'align_y_end', text: $localize `bottom`, value: 'flex-end', bootstrap: 'align-items-end'},
    {key: 'align_y_stretch', text: $localize `stretch`, value: 'stretch', bootstrap: 'align-items-stretch'},
    {key: 'align_y_baseline', text: $localize `baseline`, value: 'baseline', bootstrap: 'align-items-baseline'},
  ]
  
  alignmentVertical: FlexOption[] = [
    {key:'align_x_start', text: $localize `start`, value: 'flex-start', bootstrap: 'align-items-start'},
    {key:'align_x_center', text: $localize `center`, value: 'center', bootstrap: 'align-items-center'},
    {key:'align_x_end', text: $localize `end`, value: 'flex-end', bootstrap: 'align-items-end'},
    {key:'align_x_stretch', text: $localize `stretch`, value: 'stretch', bootstrap: 'align-items-stretch'},
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
