export type PartialConfig = Partial<Config>;

type MMs = number;
type Spaces = number;

export enum BracketingType {
    none,
    orchestral,
    smallEnsemble
}

export interface Config {
    writeSpace: MMs; // 8mm staves (1 * 8)
    writePagePadding: { top: MMs, right: MMs, bottom: MMs, left: MMs };
    writeInstrumentSpacing: Spaces;
    writeStaveSpacing: Spaces;
    writeSystemStartPadding: Spaces;

    writeInstrumentNameSize: Spaces;
    writeInstrumentNameFont: string;
    writeInstrumentNameGap: Spaces;
    writeBracketing: BracketingType;
}

export const CONFIG_SET = '@config/set';

export interface ConfigActions {
    set: (config: PartialConfig) => void;
}

export const configEmptyState = (): Config => {
    return {
        writeSpace: 1,
        writePagePadding: { top: 25, right: 25, bottom: 25, left: 25 },
        writeInstrumentSpacing: 16,
        writeStaveSpacing: 12,
        writeSystemStartPadding: 1.5,

        writeInstrumentNameSize: 4,
        writeInstrumentNameFont: 'Open Sans',
        writeInstrumentNameGap: 3,

        writeBracketing: BracketingType.orchestral
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