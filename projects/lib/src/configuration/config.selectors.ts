import { createSelector } from "@ngrx/store";
import { createHistorySelectors } from "ngrx-wieder";
import { uibConfig, ConfigState } from "./config.reducer";

const selectConfig = uibConfig.selectUibConfigState;

export const selectAll = createSelector(selectConfig, (s: ConfigState) => Object.values(s.config));
export const selectItem = (id: string) => createSelector(selectConfig, (s: ConfigState) => s.config[id]);
export const {
  selectCanUndo,
  selectCanRedo,
} = createHistorySelectors(selectConfig);

