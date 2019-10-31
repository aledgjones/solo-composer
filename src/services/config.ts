import { InstrumentAutoCountStyle } from "./instrument";

export type PartialConfig = Partial<ConfigState>;

export interface ConfigState {
    autoCountStyle: InstrumentAutoCountStyle;
}

export const CONFIG_SET = '@config/set';

export interface ConfigActions {
    set: (config: PartialConfig) => void;
}

export const configEmptyState = (): ConfigState => {
    return {
        autoCountStyle: InstrumentAutoCountStyle.arabic
    };
}

export const configReducer = (state: ConfigState, action: any) => {
    switch (action.type) {
        case CONFIG_SET: {
            const config = action.payload;
            return {
                ...state,
                ...config
            };
        }
        default:
            return state;
    }
}

export const configActions = (dispatch: any): ConfigActions => {
    return {
        set: (config) => dispatch({ type: CONFIG_SET, payload: config })
    }
}