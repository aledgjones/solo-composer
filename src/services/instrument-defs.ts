import { useMemo } from "react";
import { ClefType, ClefDef } from "../entries/clef-defs";
import { Expressions } from "../playback/expressions";
import { Patches } from "../playback/sampler";

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
    patches: Patches;
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
        shortName: "Pno.",
        staves: [
            { lines: 5, clef: { type: ClefType.G, offset: 6 } },
            { lines: 5, clef: { type: ClefType.F, offset: 2 } }
        ],
        patches: {
            [Expressions.forte]: '/patches/grand-piano/forte.json',
            [Expressions.piano]: '/patches/grand-piano/piano.json'
        }
    },
    "strings.violin": {
        id: "strings.violin",
        path: ['Strings', 'Violin'],
        longName: "Violin",
        shortName: "Vln.",
        staves: [
            { lines: 5, clef: { type: ClefType.G, offset: 6 } }
        ],
        patches: {
            [Expressions.legato]: '/patches/violin/legato.json',
            [Expressions.pizzicato]: '/patches/violin/pizzicato.json',
            [Expressions.spiccato]: '/patches/violin/spiccato.json'

        }
    },
    "strings.viola": {
        id: "strings.viola",
        path: ['Strings', 'Viola'],
        longName: "Viola",
        shortName: "Vla.",
        staves: [
            { lines: 5, clef: { type: ClefType.C, offset: 4 } }
        ],
        patches: {

        }
    },
    "strings.violoncello": {
        id: "strings.violoncello",
        path: ['Strings', 'Violoncello'],
        longName: "Violoncello",
        shortName: "Vc.",
        staves: [
            { lines: 5, clef: { type: ClefType.F, offset: 2 } }
        ],
        patches: {

        }
    },
    "strings.contrabass": {
        id: "strings.contrabass",
        path: ['Strings', 'Contrabass'],
        longName: "Contrabass",
        shortName: "Cb.",
        staves: [
            { lines: 5, clef: { type: ClefType.F, offset: 2 } }
        ],
        patches: {

        }
    },
    "brass.trombone": {
        id: "brass.trombone",
        path: ['Brass', 'Trombone'],
        longName: "Trombone",
        shortName: "Tbn.",
        staves: [
            { lines: 5, clef: { type: ClefType.F, offset: 2 } }
        ],
        patches: {

        }
    },
    "woodwinds.piccolo": {
        id: "woodwinds.piccolo",
        path: ['Woodwinds', 'Piccolo'],
        longName: "Piccolo",
        shortName: "Pc.",
        staves: [
            { lines: 5, clef: { type: ClefType.G, offset: 6 } }
        ],
        patches: {
            
        }
    },
    "woodwinds.flute": {
        id: "woodwinds.flute",
        path: ['Woodwinds', 'Flute'],
        longName: "Flute",
        shortName: "Fl.",
        staves: [
            { lines: 5, clef: { type: ClefType.G, offset: 6 } }
        ],
        patches: {
            [Expressions.legato]: "/patches/flute/legato.json"
        }
    },
    "woodwinds.oboe": {
        id: "woodwinds.oboe",
        path: ['Woodwinds', 'Oboe'],
        longName: "Oboe",
        shortName: "Ob.",
        staves: [
            { lines: 5, clef: { type: ClefType.G, offset: 6 } }
        ],
        patches: {

        }
    },
    "woodwinds.clarinet.a": {
        id: "woodwinds.clarinet.a",
        path: ['Woodwinds', 'Clarinet', 'A'],
        longName: "Clarinet in A",
        shortName: "Cl.",
        staves: [
            { lines: 5, clef: { type: ClefType.G, offset: 6 } }
        ],
        patches: {
            
        }
    },
    "woodwinds.clarinet.b-flat": {
        id: "woodwinds.clarinet.b-flat",
        path: ['Woodwinds', 'Clarinet', 'B Flat'],
        longName: "Clarinet in B♭",
        shortName: "Cl.",
        staves: [
            { lines: 5, clef: { type: ClefType.G, offset: 6 } }
        ],
        patches: {
            
        }
    },
    "woodwinds.bassoon": {
        id: "woodwinds.bassoon",
        path: ['Woodwinds', 'Bassoon'],
        longName: "Bassoon",
        shortName: "Bn.",
        staves: [
            { lines: 5, clef: { type: ClefType.F, offset: 2 } }
        ],
        patches: {
            
        }
    }
}