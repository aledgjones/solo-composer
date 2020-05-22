import { Store } from "pullstate";
import { State } from "./state";
import { InstrumentAutoCountStyle } from "./score-instrument-utils";

export type PartialConfig = Partial<ConfigState>;

export interface ConfigState {
    autoCountStyleSolo: InstrumentAutoCountStyle;
    autoCountStyleSection: InstrumentAutoCountStyle;
}

export const configEmptyState = (): ConfigState => {
    return {
        autoCountStyleSolo: InstrumentAutoCountStyle.roman,
        autoCountStyleSection: InstrumentAutoCountStyle.roman
    };
};

export const configActions = (store: Store<State>) => {
    return {
        set: (config: PartialConfig) => {
            store.update((s) => {
                s.score.config = { ...s.score.config, ...config };
            });
        }
    };
};
