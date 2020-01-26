import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { ClefDef, Clef, ClefType } from './clef-defs';
import { buildText, TextStyles, Justify, Align } from '../render/text';

export function createClef(def: ClefDef, tick: number): Entry<Clef> {
    return {
        _type: EntryType.clef,
        _key: shortid(),
        _box: { width: 2.8, height: 4 },
        _bounds: { width: 3.8, height: 4 },
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

export function drawClef(x: number, y: number, clef: Entry<Clef>) {
    const glyph = glyphFromType(clef.pitch);
    const styles: TextStyles = { color: '#000000', justify: Justify.start, align: Align.middle, size: 4, font: `Music` };
    return buildText(clef._key, styles, x, y + (.5 * clef.offset), glyph);
}