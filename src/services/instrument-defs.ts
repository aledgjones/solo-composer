import { useMemo } from "react";
import { ClefType, ClefDef } from "./entries/clef";

export interface StaveDef {
    lines: number;
    clef: ClefDef;
}

export interface InstrumentDef {
    id: string;
    path: string[];
    longName: string;
    shortName: string;
    staves: StaveDef[];
}

export interface InstrumentDefs {
    [key: string]: InstrumentDef;
}

export const useInstrumentList = (selection: InstrumentDef) => {
    return useMemo(() => {

        const keys = Object.keys(instrumentDefs);
        let defs = keys.map(key => instrumentDefs[key]);

        const lists = [];
        for (let i = 0; i < 3; i++) {
            const term = selection.path[i];
            const list = defs.reduce((output: string[], def) => {
                const step = def.path[i];
                if (step && !output.includes(step)) {
                    output.push(step);
                }
                return output;
            }, []);
            lists.push(list);
            defs = defs.filter(def => def.path[i] === term);
        }
        return lists;

    }, [selection]);
}

export function getInstrumentDef(id: string): InstrumentDef {
    return instrumentDefs[id];
}

export function getFirstInstrumentDefFromPartialPath(path: string[]): InstrumentDef {
    const keys = Object.keys(instrumentDefs);
    const defs = keys.map(key => instrumentDefs[key]);
    const matches = defs.filter(def => {
        for (let i = 0; i < path.length; i++) {
            if (def.path[i] !== path[i]) {
                return false;
            }
        }
        return true;
    });
    return matches[0];
}

export const instrumentDefs: InstrumentDefs = {
    "keyboards.piano": {
        id: "keyboards.piano",
        path: ['Keyboards', 'Piano'],
        longName: "Piano",
        shortName: "Pno",
        staves: [{ lines: 5, clef: { type: ClefType.G, position: 4 } }, { lines: 5, clef: { type: ClefType.F, position: 2 } }]
    },
    "strings.violin": {
        id: "strings.violin",
        path: ['Strings', 'Violin'],
        longName: "Violin",
        shortName: "Vln",
        staves: [{ lines: 5, clef: { type: ClefType.G, position: 4 } }]
    },
    "strings.viola": {
        id: "strings.viola",
        path: ['Strings', 'Viola'],
        longName: "Viola",
        shortName: "Vla",
        staves: [{ lines: 5, clef: { type: ClefType.C, position: 3 } }]
    },
    "strings.violoncello": {
        id: "strings.violoncello",
        path: ['Strings', 'Violoncello'],
        longName: "Violoncello",
        shortName: "Vc",
        staves: [{ lines: 5, clef: { type: ClefType.F, position: 2 } }]
    },
    "strings.contrabass": {
        id: "strings.contrabass",
        path: ['Strings', 'Contrabass'],
        longName: "Contrabass",
        shortName: "Cb",
        staves: [{ lines: 5, clef: { type: ClefType.F, position: 2 } }]
    },
    "woodwinds.piccolo": {
        id: "woodwinds.piccolo",
        path: ['Woodwinds', 'Piccolo'],
        longName: "Piccolo",
        shortName: "Pc.",
        staves: [{ lines: 5, clef: { type: ClefType.G, position: 4 } }]
    },
    "woodwinds.flute": {
        id: "woodwinds.flute",
        path: ['Woodwinds', 'Flute'],
        longName: "Flute",
        shortName: "Fl",
        staves: [{ lines: 5, clef: { type: ClefType.G, position: 4 } }]
    },
    "woodwinds.oboe": {
        id: "woodwinds.oboe",
        path: ['Woodwinds', 'Oboe'],
        longName: "Oboe",
        shortName: "Ob",
        staves: [{ lines: 5, clef: { type: ClefType.G, position: 4 } }]
    },
    "woodwinds.clarinet.a": {
        id: "woodwinds.clarinet.a",
        path: ['Woodwinds', 'Clarinet', 'A'],
        longName: "Clarinet in A",
        shortName: "Cl",
        staves: [{ lines: 5, clef: { type: ClefType.G, position: 4 } }]
    },
    "woodwinds.clarinet.b-flat": {
        id: "woodwinds.clarinet.b-flat",
        path: ['Woodwinds', 'Clarinet', 'B Flat'],
        longName: "Clarinet in B♭",
        shortName: "Cl",
        staves: [{ lines: 5, clef: { type: ClefType.G, position: 4 } }]
    },
    "woodwinds.bassoon": {
        id: "woodwinds.bassoon",
        path: ['Woodwinds', 'Bassoon'],
        longName: "Bassoon",
        shortName: "Bn",
        staves: [{ lines: 5, clef: { type: ClefType.F, position: 2 } }]
    }
}