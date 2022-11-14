import { Injectable } from '@angular/core';
import { createAction, on, props, createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { createHistorySelectors, initialUndoRedoState, undoRedo, UndoRedoState } from 'ngrx-wieder';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Condition } from '../conditions';

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

interface State extends UndoRedoState {
  config: {[id: string]: ComponentConfig};
}

const initConfig = createAction('INIT', props<{config: ComponentConfig[]}>());
const setConfig = createAction('SET', props<{config: ComponentConfig[]}>());
const addConfig = createAction('ADD', props<{config: ComponentConfig}>());
const removeConfig = createAction('REMOVE', props<{id: string}>());
const updateConfig = createAction('UPDATE', props<{config: ComponentConfig | ComponentConfig[]}>());
const updateNoHistoryConfig = createAction('UPDATE_NO_HISTORY', props<{config: ComponentConfig | ComponentConfig[]}>());

const selectConfig = createFeatureSelector<State>('uibConfig');
const selectAll = createSelector(selectConfig, (s: State) => Object.values(s.config));

const { createUndoRedoReducer } = undoRedo({
  allowedActionTypes: ['ADD', 'REMOVE', 'UPDATE'],
  maxBufferSize: Number.MAX_SAFE_INTEGER
});

export const uibConfig = createUndoRedoReducer<State>(
  {config: {}, ...initialUndoRedoState},

  on(initConfig, (state, {config}) => {
    for(let c of config) {
      state.config[c.id] = c;
    }
    return state;
  }),

  on(setConfig, (state, {config}) => {
    // Clear current state
    for(let key of Object.keys(state)) {
      delete state[key];
    }
    // Add new state
    for(let c of config) {
      state.config[c.id] = c;
    }
    return state;
  }),

  on(addConfig, (state, {config}) => {
    if(state.config[config.id]) {
      throw new Error(`Config ${config.id} already exists.`);
    }
    state.config[config.id] = config;
    return state;
  }),

  on(removeConfig, (state, {id}) => {
    delete state.config[id];
    return state;
  }),

  on(updateConfig, (state, {config}) => {
    if(!Array.isArray(config)) config = [config];
    for(let c of config) {
      state.config[c.id] = c;
    }
    return state;
  }),

  on(updateNoHistoryConfig, (state, {config}) => {
    if(!Array.isArray(config)) config = [config];
    for(let c of config) {
      state.config[c.id] = c;
    }
    return state;
  })
);

const {
  selectCanUndo,
  selectCanRedo,
} = createHistorySelectors<State, State>(selectConfig);


@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor(public store: Store<State>){
    this.store.subscribe(v => console.log(v));
  }

  public init(config: ComponentConfig[]) {
    this.store.dispatch(initConfig({config}));
  }

  public set(config: ComponentConfig[]) {
    this.store.dispatch(setConfig({config}));
  }

  public watchAllConfig(): Observable<ComponentConfig[]> {
    return this.store.select(selectAll);
  }

  public getAllConfig(): ComponentConfig[] {
    let config: ComponentConfig[] = [];
    this.store.select(selectAll).pipe(take(1)).subscribe(c => config = c);
    return config;
  }

  public watchConfig(id: string): Observable<ComponentConfig> {
    this.getConfig(id); // Ensure a value exists (if 'id' has no config)
    const selector = createSelector(selectConfig, s => s.config[id]);
    return this.store.select(selector).pipe(
      filter(config => config !== undefined),
      map((config: ComponentConfig) => JSON.parse(JSON.stringify(config)))
    );
  }

  private _getConfig(id: string): ComponentConfig | undefined {
    let config: ComponentConfig | undefined;
    const selector = createSelector(selectConfig, s => s.config[id]);
    this.store.select(selector)
      .pipe(take(1))
      .subscribe(c => config = c);
    return config;
  }

  public getConfig(id: string): ComponentConfig {
    let config = this._getConfig(id);
    if (!config) {
      config = { id, type: id };
      this.store.dispatch(updateNoHistoryConfig({config}));
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

  public updateConfig(config: ComponentConfig | ComponentConfig[]) {
    this.store.dispatch(updateConfig({config}));
  }

  public removeConfig(id: string) {
    this.store.dispatch(removeConfig({id}));
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

  public canUndo$(): Observable<boolean> {
    return this.store.select(selectCanUndo());
  }

  public canRedo$(): Observable<boolean> {
    return this.store.select(selectCanRedo());
  }

  public undo() {
    this.canUndo$().pipe(take(1)).subscribe(
      can => can && this.store.dispatch({type: "UNDO"})
    );
  }

  public redo() {
    this.canRedo$().pipe(take(1)).subscribe(
      can => can && this.store.dispatch({type: "REDO"})
    );
  }
}
