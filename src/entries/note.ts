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

export function drawNote(x: number, y: number, length?: NotationBaseLength, dotted?: boolean) {

    const glyph = glyphFromDuration(length);

    if (!glyph) {
        console.error('could not render note duration', `base duration:  ${length}`);
        return [];
    }

    const instructions = [];

    const styles: TextStyles = { color: '#000000', align: 'left', size: 4, font: `Music`, baseline: 'top' };
    instructions.push(buildText(styles, x, y, glyph));
    
    if (dotted) {
        const styles: CircleStyles = { color: '#000000' };
        instructions.push(buildCircle(styles, x + 1.5, y + 1.5, .2));
    }

    return instructions;
}