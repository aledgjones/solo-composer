import { buildText, TextStyles, Justify, Align } from "../render/text";
import { buildCircle, CircleStyles } from "../render/circle";
import { NotationBaseDuration } from "./notation-track";

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
    length: NotationBaseDuration | undefined,
    dotted: boolean,
    key: string
) {
    const glyph = glyphFromDuration(length);
    const offset = verticalOffsetFromDuration(length);

    if (!glyph) {
        console.error("could not render rest duration", `base duration: ${length}`);
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
    instructions.push(buildText(key, styles, x, y + offset, glyph));

    if (dotted) {
        const styles: CircleStyles = { color: "#000000" };
        instructions.push(buildCircle(`${key}-dot`, styles, x + 1.5, y - 0.5 + offset, 0.2));
    }

    return instructions;
}
