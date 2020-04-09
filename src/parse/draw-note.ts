import { buildText, TextStyles, Justify, Align } from '../render/text';
import { buildCircle, CircleStyles } from '../render/circle';
import { NotationBaseDuration } from './notation-track';
import { Direction } from './get-stem-direction';
import { buildCurve } from '../render/curve';
import { ToneDetails } from './draw-tick';

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

function tieYOffset(tone: ToneDetails, isChord: boolean) {
    const isInsideStave = tone.offset >= 0 && tone.offset <= 8;
    const isOnLine = tone.offset % 2 === 0;

    if (isChord) {

        if (isOnLine) {
            return .5 * tone.tie;
        } else {
            return 0;
        }

    } else {

        // * tone.tie (-1 | 1) flips the direction of the tie
        if (isInsideStave) {
            if (isOnLine) {
                return .65 * tone.tie;
            } else {
                return .75 * tone.tie;
            }
        } else {
            return .75 * tone.tie;
        }

    }
}

export function drawNote(x: number, y: number, isChord: boolean, tone: ToneDetails, duration: NotationBaseDuration | undefined, dotted: boolean, stemDirection: Direction, hasShunts: boolean, tieWidth: number, key: string) {

    const glyph = glyphFromDuration(duration);
    const glyphWidth = noteheadWidthFromDuration(duration);

    if (!glyph) {
        console.error('could not render note duration', `base duration:  ${duration}`);
        return [];
    }

    const instructions = [];

    const shuntOffset = tone.isShunt ? (stemDirection === Direction.up ? glyphWidth : -glyphWidth) : 0;

    const styles: TextStyles = { color: '#000000', justify: Justify.start, align: Align.middle, size: 4, font: `Music` };
    instructions.push(buildText(`${key}-head`, styles, x + shuntOffset, y + (tone.offset / 2), glyph));

    if (dotted) {
        const styles: CircleStyles = { color: '#000000' };
        const shift = (tone.offset) % 2 === 0 ? -.5 : 0;
        instructions.push(buildCircle(`${key}-dot`, styles, x + glyphWidth + (hasShunts ? glyphWidth : 0) + .5, y + (tone.offset / 2) + shift, .2));
    }

    if (tone.tie !== Direction.none) {

        const startX = x + glyphWidth + (isChord ? .25 : 0);
        const endX = x + tieWidth - (isChord ? .25 : 0) - (hasShunts ? glyphWidth : 0);
        const midX = startX + ((endX - startX) / 2);

        const startY = y + (tone.offset / 2) + tieYOffset(tone, isChord);

        instructions.push(buildCurve(
            `${key}-tie`,
            { color: '#000000' },
            { x: startX, y: startY, thickness: .125 },
            { x: midX, y: startY + tone.tie, thickness: .25 },
            { x: endX, y: startY, thickness: .125 }
        ));
    }

    return instructions;
}