import { Injectable } from '@angular/core';
import { createState, Store } from '@ngneat/elf';
import {
  withEntities,
  getEntity,
  addEntities,
  updateEntities,
  selectEntity,
  selectAll,
  getEntities,
  deleteEntities,
  deleteAllEntities,
} from '@ngneat/elf-entities';
import { stateHistory } from '@ngneat/elf-state-history';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Condition } from '../conditions/conditions.service';

export interface ComponentConfig {
  readonly id: string;
  type: string;
  classes?: string;
  [key: string]: any;
  condition?: Condition;
}

export interface ContainerConfig extends ComponentConfig {
  type: '_container';
  items: string[];
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  store: Store;
  historyState: any;

  init(initialValue: ComponentConfig[]) {
    const { state, config } = createState(
      withEntities<ComponentConfig>({ initialValue })
    );
    this.store = new Store({ name: 'config', state, config });
    this.historyState = stateHistory(this.store, { maxAge: Infinity });
    this.store.subscribe(console.log);
  }

  set(config: ComponentConfig[]) {
    this.store.update(
      deleteAllEntities(),
      addEntities(config)
    );
  }

  public watchAllConfig(): Observable<ComponentConfig[]> {
    return this.store.pipe(selectAll());
  }

  public getAllConfig(): ComponentConfig[] {
    return this.store.query(getEntities());
  }

  public watchConfig(id: string): Observable<ComponentConfig> {
    //console.log('watch:', id);
    this.getConfig(id); // Ensure a value exists (if 'id' has no config)
    return this.store.pipe(
      selectEntity(id),
      filter(config => config !== undefined),
      //tap((config) => console.log('change:', config)),
      map((config) => JSON.parse(JSON.stringify(config)))
    );
  }

  private _getConfig(id: string): ComponentConfig | undefined {
    return this.store.query(getEntity(id));
  }

  public getConfig(id: string): ComponentConfig {
    let config = this._getConfig(id);
    if (!config) {
      config = { id, type: id };
      this.historyState.pause();
      this.store.update(addEntities(config));
      this.historyState.resume();
    }
    return JSON.parse(JSON.stringify(config)); // Deep copy
  }

  public getContainer(id: string): ContainerConfig {
    const config = this.getConfig(id);
    if (!this.isContainerConfig(config)) {
      throw `${id} is not a container`;
    }
    return config;
  }

  public isContainer(id: string): boolean {
    return this.isContainerConfig(this._getConfig(id));
  }

  public isContainerConfig(conf: ComponentConfig|undefined): conf is ContainerConfig {
    return conf?.type === '_container';
  }

  /**
   * Test whether a given component id is used within the hierarchy of a container
   */
  public isUsed(id: string) {
    return !!this.findParent(id);
  }

  public findParent(id: string): ContainerConfig | undefined {
    return this.getAllConfig()
      .find(item => this.isContainerConfig(item) && item.items.includes(id)) as ContainerConfig | undefined;
  }

  public updateConfig(value: ComponentConfig | ComponentConfig[]) {
    //console.log('update config', this._getConfig(value.id));
    //console.log('new config', value);
    if(!Array.isArray(value)) value = [value];
    this.store.update(
      ...value.map(v => {
        if(!this._getConfig(v.id)){
          return addEntities(v)
        }
        return updateEntities([v.id], () => v)}
      )
    );
  }

  public removeConfig(id: string) {
    this.store.update(deleteEntities(id));
  }

  public generateId(type: string) {
    let idx = 1;
    let root = type.startsWith("_")? type.slice(1) : type;
    const tokens = type.split("-");
    if(tokens[tokens.length-1].match(/\d+/)) {
      idx = +tokens[tokens.length-1];
      root = tokens.slice(0, tokens.length-1).join('-');
    }
    let id = root;
    do {
      id = `${root}-${idx++}`;
    } while (this._getConfig(id) || id === type);
    return id;
  }

  public canUndo$(){
    return this.historyState.hasPast$;
  }

  public canRedo$(){
    return this.historyState.hasFuture$;
  }

  public undo() {
    this.historyState.undo();
  }

  public redo() {
    this.historyState.redo();
  }
}
