import shortid from 'shortid';
import { Entry, EntryType } from ".";

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
        _box: { width: 1, height: 1 },
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

export function drawClef(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, type: ClefType, offset: number) {
    const glyph = glyphFromType(type);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = `${height}px Music`;
    ctx.textBaseline = 'middle';
    ctx.fillText(glyph, x, y + ((height / 4) * offset));
}