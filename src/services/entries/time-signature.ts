import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { Converter } from '../render/use-converter';
import { DEBUG } from '../state';

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
        _box: { width: 1.75, height: 4 },
        _bounds: { width: 3, height: 4 },
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

export function drawTimeSignature(ctx: CanvasRenderingContext2D, x: number, y: number, time: Entry<TimeSignature>, converter: Converter) {

    const { spaces } = converter;

    if (DEBUG) {
        ctx.fillStyle = 'rgba(100, 0, 255, .4)';
        ctx.fillRect(x, y, spaces.toPX(time._box.width), spaces.toPX(time._bounds.height));
        ctx.fillStyle = 'rgba(100, 0, 255, .2)';
        ctx.fillRect(x, y, spaces.toPX(time._bounds.width), spaces.toPX(time._bounds.height));
    }

    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = `${spaces.toPX(4)}px Music`;
    ctx.textBaseline = 'middle';

    if (time.drawAs) {
        const glyph = glyphFromType(time.drawAs);
        ctx.fillText(glyph, x, y + spaces.toPX(2));
    } else {
        const countGlyph = glyphFromType(time.count.toString());
        const beatGlyph = glyphFromType(time.beat.toString());
        ctx.fillText(countGlyph, x, y + spaces.toPX(1));
        ctx.fillText(beatGlyph, x, y + spaces.toPX(3));
    }

}