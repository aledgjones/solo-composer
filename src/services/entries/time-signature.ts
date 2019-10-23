import shortid from 'shortid';
import { Entry, EntryType } from ".";

export interface TimeSignatureDef {
    count: number;
    beat: number;
    drawAs?: 'c' | 'splitc';
}

export interface TimeSignature extends TimeSignatureDef {

}

export function createTimeSignature(def: TimeSignatureDef, tick: number): Entry<TimeSignature> {
    return {
        _type: EntryType.timeSignature,
        _key: shortid(),
        _box: { width: 6, height: 1 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}

function glyphFromType(val: string) {
    switch (val) {
        case '0':
            return '\u{E080}';
        case '1':
            return '\u{E081}';
        case '2':
            return '\u{E082}';
        case '3':
            return '\u{E083}';
        case '4':
            return '\u{E084}';
        case '5':
            return '\u{E085}';
        case '6':
            return '\u{E086}';
        case '7':
            return '\u{E087}';
        case '8':
            return '\u{E088}';
        case '9':
            return '\u{E059}';
        case 'c':
            return '\u{E08A}'
        case 'splitc':
            return '\u{E08B}'
        default:
            return '\u{E08A}';
    }
}

export function drawTimeSignature(ctx: CanvasRenderingContext2D, x: number, y: number, space: number, count: number, beat: number, drawAs?: string) {

    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = `${space * 8}px Music`;
    ctx.textBaseline = 'middle';

    if (drawAs) {
        const glyph = glyphFromType(drawAs);
        ctx.fillText(glyph, x, y + (space * 4));
    } else {
        const countGlyph = glyphFromType(count.toString());
        const beatGlyph = glyphFromType(beat.toString());
        ctx.fillText(countGlyph, x, y + (space * 2));
        ctx.fillText(beatGlyph, x, y + (space * 6));
    }

}