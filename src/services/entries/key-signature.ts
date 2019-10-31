import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { ClefType, Clef } from './clef';
import { Converter } from '../render/use-converter';

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
    // convert to positive number
    const width = def.offset < 0 ? def.offset * -1 : def.offset;
    return {
        _type: EntryType.keySignature,
        _key: shortid(),
        _box: { width, height: 4 },
        _bounds: {width: width + 1, height: 4},
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

export function drawKeySignature(ctx: CanvasRenderingContext2D, x: number, y: number, clef: Entry<Clef>, key: Entry<KeySignature>, converter: Converter) {

    const { spaces } = converter;

    // ctx.fillStyle = 'rgba(255, 0, 0, .5)';
    // ctx.fillRect(x, y, spaces.toPX(key._bounds.width), spaces.toPX(key._bounds.height));

    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = `${spaces.toPX(4)}px Music`;
    ctx.textBaseline = 'middle';

    // calc naturals here - find out rules for naturalising

    if (key.offset < 0) {
        const glyph = glyphFromType(AccidentalType.flat);
        const pattern = patterns[clef.type][clef.offset][AccidentalType.flat];
        for (let i = 0; i > key.offset; i--) {
            ctx.fillText(glyph, x + spaces.toPX(i * -1), y + spaces.toPX(.5 * pattern[i * -1]));
        }
    }

    if (key.offset > 0) {
        const glyph = glyphFromType(AccidentalType.sharp);
        const pattern = patterns[clef.type][clef.offset][AccidentalType.sharp];
        for (let i = 0; i < key.offset; i++) {
            ctx.fillText(glyph, x + spaces.toPX(i), y + spaces.toPX(.5 * pattern[i]));
        }
    }
}