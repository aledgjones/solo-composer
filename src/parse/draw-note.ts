import { buildText, TextStyles, Justify, Align } from '../render/text';
import { buildCircle, CircleStyles } from '../render/circle';
import { NotationBaseDuration } from './notation-track';
import { StemDirection } from './get-stem-direction';

export interface NoteDef {
    duration: number;
    pitch: string;
}

export interface Note extends NoteDef { };

export function noteheadWidthFromDuration(baseLength?: NotationBaseDuration): number {
    switch (baseLength) {
        case NotationBaseDuration.semiquaver:
        case NotationBaseDuration.quaver:
        case NotationBaseDuration.crotchet:
        case NotationBaseDuration.minim:
            return 1.15;
        case NotationBaseDuration.semibreve:
            return 1.6;
        default:
            return 0;
    }
}

function glyphFromDuration(baseLength?: NotationBaseDuration) {
    switch (baseLength) {
        case NotationBaseDuration.semiquaver:
        case NotationBaseDuration.quaver:
        case NotationBaseDuration.crotchet:
            return '\u{E0A4}';
        case NotationBaseDuration.minim:
            return '\u{E0A3}';
        case NotationBaseDuration.semibreve:
            return '\u{E0A2}';
        default:
            return undefined;
    }
}

export function drawNotehead(x: number, y: number, pitchOffset: number, duration: NotationBaseDuration | undefined, dotted: boolean, stemDirection: StemDirection, hasShunts: boolean, isShunted: boolean, key: string) {

    const glyph = glyphFromDuration(duration);
    const glyphWidth = noteheadWidthFromDuration(duration);

    if (!glyph) {
        console.error('could not render note duration', `base duration:  ${duration}`);
        return [];
    }

    const instructions = [];

    const shuntOffset = isShunted ? (stemDirection === StemDirection.up ? glyphWidth : -glyphWidth) : 0;

    const styles: TextStyles = { color: '#000000', justify: Justify.start, align: Align.middle, size: 4, font: `Music` };
    instructions.push(buildText(`${key}-head`, styles, x + shuntOffset, y + (pitchOffset / 2), glyph));

    if (dotted) {
        const styles: CircleStyles = { color: '#000000' };
        const shift = (pitchOffset) % 2 === 0 ? -.5 : 0;
        instructions.push(buildCircle(`${key}-dot`, styles, x + glyphWidth + (hasShunts ? glyphWidth : 0) + .5, y + (pitchOffset / 2) + shift, .2));
    }

    return instructions;
}