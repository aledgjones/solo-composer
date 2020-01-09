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
    "percussion.timpani": {
        id: "percussion.timpani",
        path: ['Percussion', 'Timpani'],
        longName: "Timpani",
        shortName: "Tmp.",
        staves: [
            { lines: 5, clef: { type: ClefType.F, offset: 2 } }],
        patches: {
            [Expressions.default]: '/patches/timpani/forte.json'
        }
    },
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
            [Expressions.default]: '/patches/piano/legato.json',
            [Expressions.legato]: '/patches/piano/legato.json'
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
            [Expressions.default]: '/patches/violin/legato.json',
            [Expressions.legato]: '/patches/violin/legato.json',
            [Expressions.pizzicato]: '/patches/violin/pizzicato.json',
            [Expressions.spiccato]: '/patches/violin/spiccato.json',
            [Expressions.tremolo]: '/patches/violin/tremolo.json'
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
            [Expressions.default]: '/patches/viola/legato.json',
            [Expressions.legato]: '/patches/viola/legato.json',
            [Expressions.pizzicato]: '/patches/viola/pizzicato.json',
            [Expressions.staccato]: '/patches/viola/staccato.json'
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
            [Expressions.default]: '/patches/violoncello/legato.json',
            [Expressions.legato]: '/patches/violoncello/legato.json'
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
            [Expressions.default]: '/patches/contrabass/legato.json',
            [Expressions.legato]: '/patches/contrabass/legato.json',
            [Expressions.spiccato]: '/patches/contrabass/spiccato.json',
            [Expressions.pizzicato]: '/patches/contrabass/pizzicato.json'
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
            [Expressions.default]: ''
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
            [Expressions.default]: ''
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
            [Expressions.default]: "/patches/flute/legato.json",
            [Expressions.legato]: "/patches/flute/legato.json",
            [Expressions.staccato]: "/patches/flute/staccato.json"
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
            [Expressions.default]: '/patches/oboe/legato.json',
            [Expressions.legato]: '/patches/oboe/legato.json',
            [Expressions.staccato]: '/patches/oboe/staccato.json'
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
            [Expressions.default]: "/patches/clarinet/legato.json",
            [Expressions.legato]: "/patches/clarinet/legato.json",
            [Expressions.staccato]: "/patches/clarinet/staccato.json"
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
            [Expressions.default]: "/patches/clarinet/legato.json",
            [Expressions.legato]: "/patches/clarinet/legato.json",
            [Expressions.staccato]: "/patches/clarinet/staccato.json"
        }
    },
    "woodwinds.bass-clarinet": {
        id: "woodwinds.bass-clarinet",
        path: ['Woodwinds', 'Bass Clarinet'],
        longName: "Bass Clarinet",
        shortName: "B Cl.",
        staves: [
            { lines: 5, clef: { type: ClefType.G, offset: 6 } }
        ],
        patches: {
            [Expressions.default]: "/patches/bass-clarinet/legato.json",
            [Expressions.legato]: "/patches/bass-clarinet/legato.json"
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
            [Expressions.default]: '/patches/bassoon/legato.json',
            [Expressions.legato]: '/patches/bassoon/legato.json',
            [Expressions.staccato]: '/patches/bassoon/staccato.json',
        }
    }
}