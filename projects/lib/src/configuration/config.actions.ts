import { createAction, props } from "@ngrx/store";
import { ComponentConfig } from "./config.model";

/**
 * Initialize the configuration
 */
export const initConfig = createAction('INIT', props<{config: ComponentConfig[]}>());

/**
 * Remove the current configuration and set a new one
 */
export const setConfig = createAction('SET', props<{config: ComponentConfig[]}>());

/**
 * Add a new configuration item
 */
export const addConfig = createAction('ADD', props<{config: ComponentConfig}>());

/**
 * Remove an existing configuration item
 */
export const removeConfig = createAction('REMOVE', props<{id: string}>());

/**
 * Update an existing configuration item (or list of items)
 */
export const updateConfig = createAction('UPDATE', props<{config: ComponentConfig | ComponentConfig[]}>());
