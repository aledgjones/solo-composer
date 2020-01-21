import { buildText, TextStyles } from '../render/text';
import { buildCircle, CircleStyles } from '../render/circle';
import { NotationBaseLength } from './notation-track';
import { Justify, Align } from '../render/apply-styles';

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

export function drawRest(x: number, y: number, length?: NotationBaseLength, dotted?: boolean) {

    const glyph = glyphFromDuration(length);
    const offset = verticalOffsetFromDuration(length);

    if (!glyph) {
        console.error('could not render rest duration', `base duration: ${length}`);
        return [];
    }

    const instructions = [];

    const styles: TextStyles = { color: '#000000', justify: Justify.start, align: Align.middle, size: 4, font: `Music` };
    instructions.push(buildText(styles, x, y + offset, glyph));
    
    if (dotted) {
        const styles: CircleStyles = { color: '#000000' };
        instructions.push(buildCircle(styles, x + 1.5, y - .5 + offset, .2));
    }

    return instructions;
}