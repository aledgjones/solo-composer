import { BracketingType, BracketEndStyle } from "./render/draw-brackets";

type MMs = number;
type Spaces = number;

export type PartialEngravingConfig = Partial<EngravingConfig>;

export interface EngravingConfig {
    space: MMs; // 8mm staves (1 * 8)

    framePadding: { top: MMs, right: MMs, bottom: MMs, left: MMs };
    instrumentSpacing: Spaces;
    staveSpacing: Spaces;
    systemStartPadding: Spaces;

    staveInstrumentNameSize: Spaces;
    staveInstrumentNameFont: string;
    staveInstrumentNameGap: Spaces;

    bracketing: BracketingType;
    bracketEndStyle: BracketEndStyle;
    bracketSingleStaves: boolean;
}

export interface EngravingState {
    score: PartialEngravingConfig;
    part: PartialEngravingConfig;
}

export enum LayoutType {
    score = 'score',
    part = 'part'
}

export const ENGRAVING_SET = '@engraving/set';

export interface EngravingActions {
    set: (layout: LayoutType, config: PartialEngravingConfig) => void;
}

export const defaultEngravingConfig: EngravingConfig = {
    space: 2,
    framePadding: { top: 25, right: 25, bottom: 25, left: 25 },
    instrumentSpacing: 8,
    staveSpacing: 6,
    systemStartPadding: .75,

    staveInstrumentNameSize: 2,
    staveInstrumentNameFont: 'Open Sans',
    staveInstrumentNameGap: 2,

    bracketing: BracketingType.orchestral,
    bracketEndStyle: BracketEndStyle.wing,
    bracketSingleStaves: false
}

export const engravingEmptyState = (): EngravingState => {
    return {
        score: {},
        part: { bracketing: BracketingType.none }
    };
}

export const engravingReducer = (state: EngravingState, action: any) => {
    switch (action.type) {
        case ENGRAVING_SET: {
            const layout: LayoutType = action.payload.layout;
            const config: EngravingConfig = action.payload.config;
            return {
                ...state,
                [layout]: {
                    ...state[layout],
                    ...config
                }
            };
        }
        default:
            return state;
    }
}

export const engravingActions = (dispatch: any): EngravingActions => {
    return {
        set: (layout, config) => dispatch({ type: ENGRAVING_SET, payload: { layout, config } })
    }
}