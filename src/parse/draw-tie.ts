import { ToneDetails } from "./draw-tick";
import { Direction } from "./get-stem-direction";
import { buildCurve } from "../render/curve";

function tieYOffset(tone: ToneDetails, isChord: boolean) {
    const isInsideStave = tone.offset >= 0 && tone.offset <= 8;
    const isOnLine = tone.offset % 2 === 0;

    if (isChord) {
        if (isOnLine) {
            return 0.5 * tone.tie;
        } else {
            return 0;
        }
    } else {
        // * tone.tie (-1 | 1) flips the direction of the tie
        if (isInsideStave) {
            if (isOnLine) {
                return 0.65 * tone.tie;
            } else {
                return 0.75 * tone.tie;
            }
        } else {
            return 0.75 * tone.tie;
        }
    }
}

export function drawTie(
    x: number,
    y: number,
    tone: ToneDetails,
    glyphWidth: number,
    isChord: boolean,
    tieWidth: number,
    hasShunts: boolean,
    key: string
) {
    const instructions = [];
    if (tone.tie !== Direction.none) {
        const startX = x + glyphWidth + (isChord ? 0.25 : 0);
        const endX = x + tieWidth - (isChord ? 0.25 : 0) - (hasShunts ? glyphWidth : 0);
        const midX = startX + (endX - startX) / 2;
        const startY = y + tone.offset / 2 + tieYOffset(tone, isChord);
        instructions.push(
            buildCurve(
                `${key}-tie`,
                { color: "#000000" },
                { x: startX, y: startY, thickness: 0.125 },
                { x: midX, y: startY + tone.tie, thickness: 0.25 },
                { x: endX, y: startY, thickness: 0.125 }
            )
        );
    }
    return instructions;
}
