import { buildText, TextStyles, Justify, Align } from "../render/text";
import { buildCircle, CircleStyles } from "../render/circle";
import { NotationBaseDuration, getNotationBaseDuration, getIsDotted, Notation, NotationTrack } from "./notation-track";
import { getTicksPerBeat } from "./get-ticks-per-beat";
import { getIsEmpty } from "./get-is-empty";
import { Entry } from "../entries";
import { TimeSignature } from "../entries/time-signature";
import { sumTickWidths } from "./sum-tick-widths";
import { sumWidthUpTo } from "./sum-width-up-to";

export interface RestDef {
    duration: number;
}

export interface Rest extends RestDef {}

function glyphFromDuration(baseLength?: NotationBaseDuration) {
    switch (baseLength) {
        case NotationBaseDuration.semiquaver:
            return "\u{E4E7}";
        case NotationBaseDuration.quaver:
            return "\u{E4E6}";
        case NotationBaseDuration.crotchet:
            return "\u{E4E5}";
        case NotationBaseDuration.minim:
            return "\u{E4E4}";
        case NotationBaseDuration.semibreve:
            return "\u{E4E3}";
        case NotationBaseDuration.breve:
            return "\u{E4E2}";
        default:
            return undefined;
    }
}

function verticalOffsetFromDuration(baseLength?: NotationBaseDuration) {
    switch (baseLength) {
        case NotationBaseDuration.semibreve:
            return 1;
        default:
            return 2;
    }
}

export function drawRest(
    x: number,
    y: number,
    duration: NotationBaseDuration | undefined,
    barWidth: number,
    preWidth: number,
    isBarEmpty: boolean,
    isDotted: boolean,
    key: string
) {
    const left = x + preWidth + (isBarEmpty ? (barWidth - preWidth) / 2 - 1 : 0);

    const glyph = glyphFromDuration(duration);
    const offset = verticalOffsetFromDuration(duration);

    if (!glyph) {
        console.error("could not render rest duration", `base duration: ${duration}`);
        return [];
    }

    const instructions = [];

    const styles: TextStyles = {
        color: "#000000",
        justify: Justify.start,
        align: Align.middle,
        size: 4,
        font: `Music`
    };
    instructions.push(buildText(key, styles, left, y + offset, glyph));

    if (isDotted) {
        const styles: CircleStyles = { color: "#000000" };
        instructions.push(buildCircle(`${key}-dot`, styles, left + 1.5, y - 0.5 + offset, 0.2));
    }

    return instructions;
}
