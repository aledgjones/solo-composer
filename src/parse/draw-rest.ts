import { buildText, TextStyles, Justify, Align } from '../render/text';
import { buildCircle, CircleStyles } from '../render/circle';
import { NotationBaseLength } from './notation-track';

export interface RestDef {
    duration: number;
}

export interface Rest extends RestDef { };

function glyphFromDuration(baseLength?: NotationBaseLength) {
    switch (baseLength) {
        case NotationBaseLength.semiquaver:
            return '\u{E4E7}';
        case NotationBaseLength.quaver:
            return '\u{E4E6}';
        case NotationBaseLength.crotchet:
            return '\u{E4E5}';
        case NotationBaseLength.minim:
            return '\u{E4E4}';
        case NotationBaseLength.semibreve:
            return '\u{E4E3}';
        case NotationBaseLength.breve:
            return '\u{E4E2}';
        default:
            return undefined;
    }
}

function verticalOffsetFromDuration(baseLength?: NotationBaseLength) {
    switch (baseLength) {
        case NotationBaseLength.semibreve:
            return 1;
        default:
            return 2;
    }
}

export function drawRest(x: number, y: number, length: NotationBaseLength | undefined, dotted: boolean, key: string) {

    const glyph = glyphFromDuration(length);
    const offset = verticalOffsetFromDuration(length);

    if (!glyph) {
        console.error('could not render rest duration', `base duration: ${length}`);
        return [];
    }

    const instructions = [];

    const styles: TextStyles = { color: '#000000', justify: Justify.start, align: Align.middle, size: 4, font: `Music` };
    instructions.push(buildText(key, styles, x, y + offset, glyph));
    
    if (dotted) {
        const styles: CircleStyles = { color: '#000000' };
        instructions.push(buildCircle(`${key}-dot`, styles, x + 1.5, y - .5 + offset, .2));
    }

    return instructions;
}