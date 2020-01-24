import { buildText, TextStyles } from '../render/text';
import { buildCircle, CircleStyles } from '../render/circle';
import { NotationBaseLength } from './notation-track';
import { Justify, Align } from '../render/apply-styles';

export interface NoteDef {
    duration: number;
    pitch: string;
}

export interface Note extends NoteDef { };

function glyphFromDuration(baseLength?: NotationBaseLength) {
    switch (baseLength) {
        case NotationBaseLength.semiquaver:
        case NotationBaseLength.quaver:
        case NotationBaseLength.crotchet:
            return '\u{E0A4}';
        case NotationBaseLength.minim:
            return '\u{E0A3}';
        case NotationBaseLength.semibreve:
            return '\u{E0A2}';
        default:
            return undefined;
    }
}

export function drawNotehead(x: number, y: number, offset: number, length: NotationBaseLength | undefined, dotted: boolean) {

    const glyph = glyphFromDuration(length);

    if (!glyph) {
        console.error('could not render note duration', `base duration:  ${length}`);
        return [];
    }

    const instructions = [];

    const styles: TextStyles = { color: '#000000', justify: Justify.start, align: Align.middle, size: 4, font: `Music` };
    instructions.push(buildText(styles, x, y + offset, glyph));

    if (dotted) {
        const styles: CircleStyles = { color: '#000000' };
        const shift = (offset * 2) % 2 === 0 ? -.5 : 0;
        instructions.push(buildCircle(styles, x + 1.75, y + offset + shift, .2));
    }

    return instructions;
}