import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigurableService} from '../../configurable';
import { ComponentConfig } from '../../configuration';

@Component({
  selector: 'uib-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['tree.component.css'],
})
export class TreeComponent implements OnChanges {
  @Input() configuration: ComponentConfig[];
  
  root: Partial<ComponentConfig>[];
  
  private configurationMap: Map<string, Partial<ComponentConfig>>;
  
  constructor(
    public configurableService: ConfigurableService,
    private cdr: ChangeDetectorRef
  ) {
   
    // listen to edited's element event
    this.configurableService.edited$.pipe(tap(this.cdr.markForCheck))
  }
  
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
}
