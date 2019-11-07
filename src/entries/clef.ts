import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { Converter } from '../services/render/use-converter';
import { DEBUG } from '../services/state';

export enum ClefType {
    C = 1,
    F,
    G
}

export interface ClefDef {
    type: ClefType;
    offset: number;
}

export interface Clef extends ClefDef { }

export function createClef(def: ClefDef, tick: number): Entry<Clef> {
    return {
        _type: EntryType.clef,
        _key: shortid(),
        _box: { width: 2.8, height: 4 },
        _bounds: { width: 3.55, height: 4 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}

function glyphFromType(type: ClefType) {
    switch (type) {
        case ClefType.C:
            return '\u{E05C}';
        case ClefType.F:
            return '\u{E062}';
        case ClefType.G:
        default:
            return '\u{E050}';

    }
}

export function drawClef(ctx: CanvasRenderingContext2D, x: number, y: number, clef: Entry<Clef>, converter: Converter) {
    const { spaces } = converter;

    if (DEBUG) {
        ctx.fillStyle = 'rgba(100, 0, 255, .4)';
        ctx.fillRect(x, y, spaces.toPX(clef._box.width), spaces.toPX(clef._bounds.height));
        ctx.fillStyle = 'rgba(100, 0, 255, .2)';
        ctx.fillRect(x, y, spaces.toPX(clef._bounds.width), spaces.toPX(clef._bounds.height));
    }

    const glyph = glyphFromType(clef.type);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = `${spaces.toPX(4)}px Music`;
    ctx.textBaseline = 'middle';
    ctx.fillText(glyph, x, y + spaces.toPX(.5 * clef.offset));
}