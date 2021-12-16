import { Injectable } from '@angular/core';
import { createState, Store } from '@ngneat/elf';
import {
  withEntities,
  getEntity,
  addEntities,
  updateEntities,
  selectEntity,
  selectAll,
} from '@ngneat/elf-entities';
import { stateHistory } from '@ngneat/elf-state-history';
import { map, Observable } from 'rxjs';

export interface ComponentConfig {
  id: string;
  type: string;
  classes?: string;
  [key: string]: any;
}

export interface ContainerConfig extends ComponentConfig {
  type: 'container';
  items: string[];
  template?: string;
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

  public watchAllConfig() {
    return this.store.pipe(selectAll());
  }

  public watchConfig(id: string): Observable<ComponentConfig> {
    //console.log('watch:', id);
    this.getConfig(id); // Ensure a value exists (if 'id' has no config)
    return this.store.pipe(
      selectEntity(id),
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
      this.store.update(addEntities(config));
    }
    return JSON.parse(JSON.stringify(config)); // Deep copy
  }

  public getContainer(id: string): ContainerConfig {
    const config = this.getConfig(id) as ContainerConfig;
    if (config.type !== 'container') {
      throw `${id} is not a container`;
    }
    return config;
  }

  public isContainer(id: string): boolean {
    return this._getConfig(id)?.type === 'container';
  }

  public isTemplate(id: string): boolean {
    const conf = this._getConfig(id);
    return conf && conf.type === 'container' && conf.template;
  }

  public updateConfig(value: ComponentConfig | ComponentConfig[]) {
    //console.log('update config', this._getConfig(value.id));
    //console.log('new config', value);
    if(!Array.isArray(value)) value = [value];
    this.store.update(
      ...value.map(v => updateEntities([v.id], () => v))
    );
  }

  public generateId(type: string) {
    let idx = 1;
    let id = type;
    while (this._getConfig(id)) {
      id = `${type}-${idx++}`;
    }
    return id;
  }

  public undo() {
    this.historyState.undo();
  }

  public redo() {
    this.historyState.redo();
  }
}