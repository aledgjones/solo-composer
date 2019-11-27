import { buildText, TextStyles } from '../render/text';
import { buildCircle, CircleStyles } from '../render/circle';

export interface RestDef {
    duration: number;
}

export interface Rest extends RestDef { };

function glyphFromDuration(duration: number, subdivisions: number) {
    switch (duration / subdivisions) {
        case .25: // semiquaver
            return '\u{E4E7}';
        case .5: // quaver
            return '\u{E4E6}';
        case 1: // crotchet
            return '\u{E4E5}';
        case 2: // minim
            return '\u{E4E4}';
        case 4: // whole
            return '\u{E4E3}'
        default:
            return undefined;
    }
}

function offsetFromDuration(duration: number, subdivisions: number) {
    switch (duration / subdivisions) {
        case 4:
            return -1;
        default:
            return 0;
    }
}

export function drawRest(x: number, y: number, duration: number, subdivisions: number) {

    let isDotted = false;
    let glyph = glyphFromDuration(duration, subdivisions);
    let offset = offsetFromDuration(duration, subdivisions);
    if (!glyph) {
        glyph = glyphFromDuration((duration / 3) * 2, subdivisions);
        offset = offsetFromDuration(duration, subdivisions);
        if (glyph) {
            isDotted = true;
        } else {
            console.error('could not render rest duration', `duration: ${duration}`, `${subdivisions}/crotchet`);
            return [];
        }
    }

    const instructions = [];

    const styles: TextStyles = { color: '#000000', align: 'left', size: 4, font: `Music`, baseline: 'top' };
    instructions.push(buildText(styles, x, y + offset, glyph));
    if (isDotted) {
        const styles: CircleStyles = { color: '#000000' };
        instructions.push(buildCircle(styles, x + 1.5, y + 1.5 + offset, .2));
    }

    return instructions;
}