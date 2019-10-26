export type PartialConfig = Partial<Config>;

export interface Config {
    writeSpace: number;
    writePagePadding: { top: number, right: number, bottom: number, left: number };
    writeInstrumentSpacing: number;
    writeStaveSpacing: number;
    writeSystemStartPadding: number;

    writeInstrumentNameSize: number;
    writeInstrumentNameFont: string;
    writeInstrumentNameGap: number;
}

export const CONFIG_SET = '@config/set';

export interface ConfigActions {
    set: (config: PartialConfig) => void;
}

export const configEmptyState = (): Config => {
    return {
        writeSpace: 1, // 8mm staves (1 * 8)
        writePagePadding: {
            top: 25,
            right: 25,
            bottom: 25,
            left: 25
        },
        writeInstrumentSpacing: 16,
        writeStaveSpacing: 12,
        writeSystemStartPadding: 1.5,

        writeInstrumentNameSize: 4,
        writeInstrumentNameFont: 'Open Sans',
        writeInstrumentNameGap: 3
    };
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