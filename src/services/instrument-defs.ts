import { useMemo } from "react"

export interface InstrumentDef {
    id: string;
    path: string[];
    longName: string;
    shortName: string;
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
    "brass.trumpet.b-flat": {
        id: "brass.trumpet.b-flat",
        path: ['Brass', 'Trumpet', 'B Flat'],
        longName: "Trumpet",
        shortName: "Trmp"
    },
    "brass.trumpet.c": {
        id: "brass.trumpet.c",
        path: ['Brass', 'Trumpet', 'C'],
        longName: "Trumpet",
        shortName: "Trmp"
    },
    "keyboards.piano": {
        id: "keyboards.piano",
        path: ['Keyboards', 'Piano'],
        longName: "Piano",
        shortName: "Pno"
    },
    "strings.violin": {
        id: "strings.violin",
        path: ['Strings', 'Violin'],
        longName: "Violin",
        shortName: "Vln"
    },
    "strings.viola": {
        id: "trings.viola",
        path: ['Strings', 'Viola'],
        longName: "Viola",
        shortName: "Vla"
    },
    "strings.violoncello": {
        id: "strings.violoncello",
        path: ['Strings', 'Violoncello'],
        longName: "Violoncello",
        shortName: "Vc"
    },
    "strings.contrabass": {
        id: "strings.contrabass",
        path: ['Strings', 'Contrabass'],
        longName: "Contrabass",
        shortName: "Cb"
    },
    "woodwinds.piccolo": {
        id: "woodwinds.piccolo",
        path: ['Woodwinds', 'Piccolo'],
        longName: "Piccolo",
        shortName: "Pc."
    },
    "woodwinds.flute": {
        id: "woodwinds.flute",
        path: ['Woodwinds', 'Flute'],
        longName: "Flute",
        shortName: "Fl"
    },
    "woodwinds.oboe": {
        id: "woodwinds.oboe",
        path: ['Woodwinds', 'Oboe'],
        longName: "Oboe",
        shortName: "Ob"
    },
    "woodwinds.clarinet.a": {
        id: "woodwinds.clarinet.a",
        path: ['Woodwinds', 'Clarinet', 'A'],
        longName: "Clarinet in A",
        shortName: "Cl"
    },
    "woodwinds.clarinet.b-flat": {
        id: "woodwinds.clarinet.b-flat",
        path: ['Woodwinds', 'Clarinet', 'B Flat'],
        longName: "Clarinet in B♭",
        shortName: "Cl"
    },
    "woodwinds.bass-clarinet": {
        id: "woodwinds.bass-clarinet",
        path: ['Woodwinds', 'Bass Clarinet'],
        longName: "Bass Clarinet in B♭",
        shortName: "B. Cl"
    },
    "woodwinds.bassoon": {
        id: "woodwinds.bassoon",
        path: ['Woodwinds', 'Bassoon'],
        longName: "Bassoon",
        shortName: "Bn"
    }
}