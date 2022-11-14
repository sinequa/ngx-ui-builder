import { createSelector } from "@ngrx/store";
import { createHistorySelectors } from "ngrx-wieder";
import { uibConfig } from "./config.reducer";

const selectConfig = uibConfig.selectUibConfigState;

export const selectAll = createSelector(selectConfig, s => Object.values(s.config));
export const selectItem = (id: string) => createSelector(selectConfig, s => s.config[id]);
export const {
  selectCanUndo,
  selectCanRedo,
} = createHistorySelectors(selectConfig);

