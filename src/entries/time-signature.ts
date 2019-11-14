import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { TextStyles, buildText } from '../render/text';

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

export function drawTimeSignature(x: number, y: number, time: Entry<TimeSignature>) {

    const instructions = [];
    const styles: TextStyles = {
        color: '#000000',
        font: 'Music',
        size: 4,
        align: 'left',
        baseline: 'middle'
    }

    if (time.drawAs) {
        const glyph = glyphFromType(time.drawAs);
        instructions.push(buildText(styles, x, y + 2, glyph));
    } else {
        const countGlyph = glyphFromType(time.count.toString());
        const beatGlyph = glyphFromType(time.beat.toString());
        instructions.push(buildText(styles, x, y + 1, countGlyph));
        instructions.push(buildText(styles, x, y + 3, beatGlyph));
    }

    return instructions;

}