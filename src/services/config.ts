import { px } from "./render/units";
import { Padding, padding } from "./render/padding";

export type PartialConfig = Partial<Config>;

export interface Config {
    writePagePadding: Padding;
    writeInstrumentSpacing: number;
    writeStaveSize: number;
    writeStaveSpacing: number;
    writeSystemStartPadding: number

    writeInstrumentNameSize: number;
    writeInstrumentNameFont: string;
    writeInstrumentNameGap: number;
}

export const defaults: Config = {
    writePagePadding: padding(25, 25, 25, 25),
    writeInstrumentSpacing: px(16),
    writeStaveSize: px(8),
    writeStaveSpacing: px(12),
    writeSystemStartPadding: px(1.5),

    writeInstrumentNameSize: px(4),
    writeInstrumentNameFont: 'Open Sans',
    writeInstrumentNameGap: px(6)
}

export const CONFIG_SET = '@config/set';

export interface ConfigActions {
    set: (config: PartialConfig) => void;
}

export const configEmptyState = (): Config => {
    return defaults;
}

export const configReducer = (state: Config, action: any) => {
    switch (action.type) {
        case CONFIG_SET:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

export const configActions = (dispatch: any) => {
    return {
        set: (config: PartialConfig) => dispatch({ type: CONFIG_SET, payload: config })
    }
}