import { Condition } from "../conditions";

type StringWithAutocomplete<T> = T | (string & Record<never, never>);

/**
 * An object containing the configuration of a component.
 */
export type ComponentConfig = {
  /** Unique string identifying the component */
  readonly id: string,
  /** The type is should correspond to a template injected in a
      uib-zone component, so that this component can be displayed */
  type: StringWithAutocomplete<'_container' | '_raw'>,
  /** Optional list of CSS class injected in the div
      wrapping the template of this component */
  classes?: string,
  /** Any parameter needed to display the component */
  [key: string]: any;
  /** An optional condition to display the component only when
      some conditions are met */
  condition?: Condition,
  /** Any custom display name */
  display?: string,
}

/**
 * A specific type of object configuration for "containers", including
 * the list of items that this container contains.
 */
export interface ContainerConfig extends ComponentConfig {
  type: '_container';
  /** List of component ids displayed in this container */
  items: string[];
}
