import { createFeature, on } from "@ngrx/store";
import { initialUndoRedoState, undoRedo, UndoRedoState } from "ngrx-wieder";
import { addConfig, initConfig, removeConfig, setConfig, updateConfig } from "./config.actions";
import { ComponentConfig } from "./config.model";

interface ConfigState extends UndoRedoState {
  config: {[id: string]: ComponentConfig};
}

const { createUndoRedoReducer } = undoRedo({
  allowedActionTypes: [addConfig.type, removeConfig.type, updateConfig.type],
  maxBufferSize: Number.MAX_SAFE_INTEGER
});

function storeConfig(state: ConfigState, config: ComponentConfig[]) {
  for(let c of config) {
    state.config[c.id] = c;
  }
  return state;
}

const reducer = createUndoRedoReducer<ConfigState>(
  {config: {}, ...initialUndoRedoState},

  on(initConfig, (state, {config}) => storeConfig(state, config)),

  on(setConfig, (state, {config}) => {
    // Clear current state
    for(let key of Object.keys(state)) {
      delete state[key];
    }
    // Add new state
    return storeConfig(state, config);
  }),

  on(addConfig, (state, {config}) => {
    if(state.config[config.id]) {
      throw new Error(`Config ${config.id} already exists.`);
    }
    return storeConfig(state, [config]);
  }),

  on(removeConfig, (state, {id}) => {
    delete state.config[id];
    return state;
  }),

  on(updateConfig, (state, {config}) => {
    if(!Array.isArray(config)) config = [config];
    return storeConfig(state, config);
  })
);


export const uibConfig = createFeature({ name: 'uibConfig', reducer });
