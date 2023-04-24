import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { initConfig, removeConfig, setConfig, updateConfig } from './config.actions';
import { ComponentConfig, ContainerConfig } from './config.model';
import { selectAll, selectCanRedo, selectCanUndo, selectItem } from './config.selectors';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor(
    public store: Store
  ){}

  /**
   * Initialize configuration assuming the store is empty.
   * No object is removed and the state history is not modified.
   * @param config list of configuration items to manage
   */
  public init(config: ComponentConfig[]) {
    this.store.dispatch(initConfig({config}));
  }

  /**
   * Set the configuration assuming the store is not empty.
   * All previously existing objects are removed and the state
   * history is reset.
   * @param config
   */
  public set(config: ComponentConfig[]) {
    this.store.dispatch({type: 'CLEAR'}); // Clear the previous history, as the previous actions won't work on new objects
    this.store.dispatch(setConfig({config}));
  }

  /**
   * Watch any change in the configuration objects.
   */
  public watchAllConfig(): Observable<ComponentConfig[]> {
    return this.store.select(selectAll);
  }

  /**
   * @returns all current configuration
   */
  public getAllConfig(): ComponentConfig[] {
    let config: ComponentConfig[] = [];
    this.watchAllConfig().pipe(take(1)).subscribe(c => config = c);
    return config;
  }

  /**
   * Watch changes of one specific configuration object
   */
  public watchConfig(id: string): Observable<ComponentConfig> {
    this.getConfig(id); // Ensure a value exists (if 'id' has no config)
    return this.store.select(selectItem(id)).pipe(
      filter(config => !!config),
      map((config: ComponentConfig) => JSON.parse(JSON.stringify(config)))
    );
  }

  private _getConfig(id: string): ComponentConfig | undefined {
    let config: ComponentConfig | undefined;
    this.store.select(selectItem(id))
      .pipe(take(1))
      .subscribe(c => config = c);
    return config;
  }

  /**
   * @returns the current configuration of a specific item with the given id
   */
  public getConfig(id: string): ComponentConfig {
    let config = this._getConfig(id);
    if (!config) {
      config = { id, type: id };
      this.store.dispatch(initConfig({config: [config]})); // Use init instead of add, because add is undoable
    }
    return JSON.parse(JSON.stringify(config)); // Deep copy
  }

  /**
   * @returns the current configuration of a specific container item with the given id
   */
  public getContainer(id: string): ContainerConfig {
    const config = this.getConfig(id);
    if (!this.isContainerConfig(config)) {
      throw `${id} is not a container`;
    }
    return config;
  }

  /**
   * @returns true if the configuration with the given id is a container
   */
  public isContainer(id: string): boolean {
    return this.isContainerConfig(this._getConfig(id));
  }

  /**
   * @returns true if the given configuration is a container
   */
  public isContainerConfig(conf: ComponentConfig|undefined): conf is ContainerConfig {
    return conf?.type === '_container';
  }

  /**
   * Test whether a given component id is used within the hierarchy of a container
   */
  public isUsed(id: string) {
    return !!this.findParent(id);
  }

  /**
   * @returns the configuration of a container that includes the given id as a child item
   */
  public findParent(id: string): ContainerConfig | undefined {
    return this.getAllConfig()
      .find(item => this.isContainerConfig(item) && item.items.includes(id)) as ContainerConfig | undefined;
  }

  /**
   * Update the configuration of a given component or list of components
   */
  public updateConfig(config: ComponentConfig | ComponentConfig[]) {
    this.store.dispatch(updateConfig({config}));
  }

  /**
   * Remove the configuration of a component with the given id
   */
  public removeConfig(id: string) {
    this.store.dispatch(removeConfig({id}));
  }

  /**
   * @returns a new unique component id for the given component type
   */
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

  /**
   * @returns an observable state for the possibility of undoing the last action
   */
  public canUndo$(): Observable<boolean> {
    return this.store.select(selectCanUndo());
  }

  /**
   * @returns an observable state for the possibility of redoing the next action
   */
  public canRedo$(): Observable<boolean> {
    return this.store.select(selectCanRedo());
  }

  /**
   * Undo the last action if possible
   */
  public undo() {
    this.canUndo$().pipe(take(1)).subscribe(
      can => can && this.store.dispatch({type: "UNDO"})
    );
  }

  /**
   * Redo the next action if possible
   */
  public redo() {
    this.canRedo$().pipe(take(1)).subscribe(
      can => can && this.store.dispatch({type: "REDO"})
    );
  }

  public exportConfiguration() {
    const config = JSON.stringify(this.getAllConfig(), null, 2);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(config));
    element.setAttribute('download', "config.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
