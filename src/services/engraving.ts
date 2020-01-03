import { BracketingType, BracketEndStyle } from "../parse/draw-brackets";
import { BarlineType } from "../entries/barline";

type MMs = number;
type Spaces = number;

export type PartialEngravingConfig = Partial<EngravingConfig>;

export interface EngravingConfig {
    space: MMs; // 8mm staves (1 * 8)

    framePadding: { top: MMs, right: MMs, bottom: MMs, left: MMs };
    instrumentSpacing: Spaces;
    staveSpacing: Spaces;
    systemStartPadding: Spaces;

    instrumentName: { size: Spaces; font: string; align: CanvasTextAlign; gap: Spaces; };
    tempo: { size: Spaces; font: string; align: CanvasTextAlign; distanceFromStave: number };

    bracketing: BracketingType;
    bracketEndStyle: BracketEndStyle;
    bracketSingleStaves: boolean;
    subBracket: boolean;

    minNoteSpacing: Spaces;

    finalBarlineType: BarlineType
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
    framePadding: { top: 40, right: 25, bottom: 40, left: 25 },
    instrumentSpacing: 8,
    staveSpacing: 6,
    systemStartPadding: .75,

    instrumentName: { size: 1.75, font: 'Libre Baskerville', align: 'right', gap: 2 },
    tempo: { size: 1.75, font: 'Libre Baskerville', align: 'left', distanceFromStave: 2 },

    bracketing: BracketingType.orchestral,
    bracketEndStyle: BracketEndStyle.wing,
    bracketSingleStaves: false,
    subBracket: true,

    minNoteSpacing: 1.6,

    finalBarlineType: BarlineType.final
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