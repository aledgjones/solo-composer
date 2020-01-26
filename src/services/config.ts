import { Store } from "pullstate";
import { State } from "./state";
import { InstrumentAutoCountStyle } from "./instrument";

export type PartialConfig = Partial<ConfigState>;

export interface ConfigState {
    autoCountStyle: InstrumentAutoCountStyle;
}

export const configEmptyState = (): ConfigState => {
    return {
        autoCountStyle: InstrumentAutoCountStyle.roman
    };
}

export const configActions = (store: Store<State>) => {
    return {
        set: (config: PartialConfig) => {
            store.update(s => {
                s.score.config = { ...s.score.config, ...config }
            });
        }
    }
}