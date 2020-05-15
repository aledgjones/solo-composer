import { buildText, TextStyles, Justify, Align } from "../render/text";
import { Direction } from "./get-stem-direction";
import { ToneDetails } from "./draw-tick";

export function drawNotehead(
    x: number,
    y: number,
    tone: ToneDetails,
    glyph: string | undefined,
    glyphWidth: number,
    stemDirection: Direction,
    key: string
) {
    if (!glyph) {
        console.error("could not render note duration", `${key}`);
        return [];
    }

    const instructions = [];

    const shuntOffset = tone.isShunt ? (stemDirection === Direction.up ? glyphWidth : -glyphWidth) : 0;

    const styles: TextStyles = {
        color: "#000000",
        justify: Justify.start,
        align: Align.middle,
        size: 4,
        font: `Music`
    };
    instructions.push(buildText(`${key}-head`, styles, x + shuntOffset, y + tone.offset / 2, glyph));

    return instructions;
}
