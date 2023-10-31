import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConfigurableService} from '../../configurable';
import { ComponentConfig, ConfigService } from '../../configuration';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from "../../utils/svg-icon/svg-icon.component";
import { ModalComponent } from '../../utils';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'uib-tree',
    standalone: true,
    templateUrl: './tree.component.html',
    styleUrls: ['tree.component.css'],
    imports: [CommonModule, SvgIconComponent, ModalComponent, FormsModule]
})
export class TreeComponent implements OnChanges {
  @Input() configuration: ComponentConfig[];

  root: Partial<ComponentConfig>[];
  hoveredId?: string;
  configToEdit?: {id: string, display: string};
  displayName?: string;

  private configurationMap: Map<string, Partial<ComponentConfig>>;

  constructor(public configurableService: ConfigurableService,
    public configService: ConfigService) { }

  ngOnChanges(changes: SimpleChanges) {
    // set our Map object,
    this.configurationMap = new Map();
    this.configuration.forEach((el) => this.configurationMap.set(el.id, el));

    // set children parent_id and order
    this.configuration
      .filter((parent) => parent.items && parent.items.length > 0)
      .forEach((parent) =>
        parent.items.forEach((id: string, index: number) => {
          // a child could have multiple parents
          // get child's parents
          const {parents = [], orders = {}} = this.configurationMap.get(id) || {};
          this.configurationMap.set(id, {...this.configurationMap.get(id), id: id, parents: [...parents, parent.id], orders: {...orders, [parent.id]: index }} )
        })
    );

    // items without parent_id (root level)
    this.root = [...this.configurationMap.values()].filter((el) => el.parents === undefined);
  }

  /**
   * Given an id, return all the children of that id.
   * @param {string} id - string - The id of the component.
   * @returns The children of the component with the given id.
   */
  children(id: string): Partial<ComponentConfig>[] {
    return [...this.configurationMap.values()].filter((el) => el.parents ? el.parents.includes(id) : false).sort((a, b) => a.orders[id] - b.orders[id]);
  }

  select(id: string) {
    const el = this.configurableService.configurableDirectiveMap.get(id);
    el?.click(new MouseEvent("click"));
    el?.nativeElement.scrollIntoView({behavior: 'smooth', inline: 'nearest', block: 'center'});
  }

  hover(id: string | undefined) {
    this.hoveredId = id; // used to display and hide the edit icons
    const hoveredId = this.configurableService.hoveredId;
    if (hoveredId) {
      const prev = this.configurableService.configurableDirectiveMap.get(hoveredId);
      prev?.removeHighlight();
    }

    this.configurableService.hoveredId = id;
    if (id) {
      const el = this.configurableService.configurableDirectiveMap.get(id);
      el?.addHighlight();

      el?.nativeElement.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'center' });
    }
  }

  editConfigDisplayName(context: {id: string, display: string}) {
    this.configToEdit = context;
    this.displayName = context.display ? String(context.display) : undefined;
  }

  onModalClose(validated: boolean) {
    if (validated) {
      const config = this.configService.getConfig(this.configToEdit!.id);
      config.display = this.displayName;
      this.configService.updateConfig(config);
    }
    this.configToEdit = undefined;
  }
}
