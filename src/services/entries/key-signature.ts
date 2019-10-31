import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { ClefType } from './clef';

export enum KeySignatureMode {
    major = 1,
    minor
}

export interface KeySignatureDef {
    mode: KeySignatureMode;
    offset: number;
}

export interface KeySignature extends KeySignatureDef {

}

export function createKeySignature(def: KeySignatureDef, tick: number): Entry<KeySignature> {
    const width = (def.offset < 0 ? def.offset * -1 : def.offset) + (def.offset === 0 ? 0 : 1);
    return {
        _type: EntryType.keySignature,
        _key: shortid(),
        _box: { width, height: 1 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}

export enum AccidentalType {
    doubleFlat = -2,
    flat = -1,
    natural = 0,
    sharp = 1,
    doubleSharp = 2
}

interface Patterns {
    [clefType: number]: {
        [clefOffset: number]: {
            [accidentalType: number]: number[]
        }
    }
}

const patterns: Patterns = {
    [ClefType.C]: {
        2: {
            [AccidentalType.flat]: [3, 0, 4, 1, 5, 2, 6],
            [AccidentalType.natural]: [],
            [AccidentalType.sharp]: [6, 2, 5, 1, 4, 0, 3]
        },
        4: {
            [AccidentalType.flat]: [5, 2, 6, 3, 7, 4, 8],
            [AccidentalType.natural]: [],
            [AccidentalType.sharp]: [1, 4, 0, 3, 6, 2, 5]
        }
    },
    [ClefType.F]: {
        2: {
            [AccidentalType.flat]: [6, 3, 7, 4, 8, 5, 9],
            [AccidentalType.natural]: [],
            [AccidentalType.sharp]: [2, 5, 1, 4, 7, 3, 6]
        }
    },
    [ClefType.G]: {
        6: {
            [AccidentalType.flat]: [4, 1, 5, 2, 6, 3, 7],
            [AccidentalType.natural]: [],
            [AccidentalType.sharp]: [0, 3, -1, 2, 5, 1, 4]
        }
    }
}

function glyphFromType(type: AccidentalType) {
    switch (type) {
        case AccidentalType.doubleFlat:
            return '\u{E264}';
        case AccidentalType.flat:
            return '\u{E260}';
        case AccidentalType.sharp:
            return '\u{E262}';
        case AccidentalType.doubleSharp:
            return '\u{E263}';
        case AccidentalType.natural:
        default:
            return '\u{E261}';

    }
}

export function drawKeySignature(ctx: CanvasRenderingContext2D, x: number, y: number, space: number, clefType: ClefType, clefOffset: number, keyOffset: number) {

    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = `${space * 4}px Music`;
    ctx.textBaseline = 'middle';

    let step = space / 2;

    // calc naturals here - find out rules for naturalising

    if (keyOffset < 0) {
        const glyph = glyphFromType(AccidentalType.flat);
        const pattern = patterns[clefType][clefOffset][AccidentalType.flat];
        for (let i = 0; i > keyOffset; i--) {
            const pointer = i * -1;
            const left = pointer * 2;
            ctx.fillText(glyph, x + (left * step), y + (step * pattern[pointer]));
        }
    }

    if (keyOffset > 0) {
        const glyph = glyphFromType(AccidentalType.sharp);
        const pattern = patterns[clefType][clefOffset][AccidentalType.sharp];
        for (let i = 0; i < keyOffset; i++) {
            const left = i * 2;
            ctx.fillText(glyph, x + (left * step), y + (step * pattern[i]));
        }
    }
}