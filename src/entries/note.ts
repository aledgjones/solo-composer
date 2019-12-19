import { buildText, TextStyles } from '../render/text';
import { buildCircle, CircleStyles } from '../render/circle';
import { NotationBaseLength } from '../parse/notation-track';

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

export function drawNote(x: number, y: number, offset: number, length?: NotationBaseLength, dotted?: boolean) {

    const glyph = glyphFromDuration(length);

    if (!glyph) {
        console.error('could not render note duration', `base duration:  ${length}`);
        return [];
    }

    const instructions = [];

    const styles: TextStyles = { color: '#000000', align: 'left', size: 4, font: `Music`, baseline: 'middle' };
    instructions.push(buildText(styles, x, y + offset, glyph));

    if (dotted) {
        const styles: CircleStyles = { color: '#000000' };
        const shift = (offset * 2) % 2 === 0 ? -.5 : 0;
        instructions.push(buildCircle(styles, x + 1.75, y + offset + shift, .2));
    }

    return instructions;
}