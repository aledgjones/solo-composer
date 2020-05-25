import { Store } from "pullstate";
import { State } from "./state";
import { BracketingType, BracketEndStyle } from "../parse/draw-brackets";
import { BarlineType } from "../entries/barline";
import { Justify } from "../render/text";

type MMs = number;
type Spaces = number;

export type PartialEngravingConfig = Partial<EngravingConfig>;

export interface EngravingConfig {
    space: MMs; // 8mm staves (1 * 8)

    framePadding: { top: MMs; right: MMs; bottom: MMs; left: MMs };
    instrumentSpacing: Spaces;
    staveSpacing: Spaces;
    systemStartPadding: Spaces;

    instrumentName: { size: Spaces; font: string; align: Justify; gap: Spaces };
    tempo: { size: Spaces; font: string; align: Justify; distanceFromStave: number };

    systemicBarlineSingleInstrumentSystem: boolean;
    bracketing: BracketingType;
    bracketEndStyle: BracketEndStyle;
    bracketSingleStaves: boolean;
    subBracket: boolean;

    minNoteSpacing: Spaces;

    finalBarlineType: BarlineType;
}

export type EngravingState = {
    [layoutType in LayoutType]: PartialEngravingConfig;
};

export enum LayoutType {
    score = 1,
    part = 2
}

export const defaultEngravingConfig: EngravingConfig = {
    space: 2,
    framePadding: { top: 40, right: 25, bottom: 40, left: 25 },
    instrumentSpacing: 8,
    staveSpacing: 6,
    systemStartPadding: 0.75,

    instrumentName: { size: 1.75, font: "Libre Baskerville", align: Justify.end, gap: 2 },
    tempo: { size: 1.75, font: "Libre Baskerville", align: Justify.start, distanceFromStave: 2 },

    systemicBarlineSingleInstrumentSystem: false,
    bracketing: BracketingType.orchestral,
    bracketEndStyle: BracketEndStyle.wing,
    bracketSingleStaves: false,
    subBracket: true,

    minNoteSpacing: 1.6,

    finalBarlineType: BarlineType.final
};

export const engravingEmptyState = (): EngravingState => {
    return {
        [LayoutType.score]: {},
        [LayoutType.part]: {
            bracketing: BracketingType.none
        }
    };
};

export const engravingActions = (store: Store<State>) => {
    return {
        set: (layout: LayoutType, config: PartialEngravingConfig) => {
            store.update((s) => {
                s.score.engraving[layout] = { ...s.score.engraving[layout], ...config };
            });
        }
    };
};
