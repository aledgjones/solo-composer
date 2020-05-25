import { ToneDetails } from "./draw-tick";
import { Direction } from "./get-stem-direction";
import { buildCurve } from "../render/curve";

function tiePointsY(y: number, tone: ToneDetails, width: number, isChord: boolean) {
    const isOnLine = tone.offset % 2 === 0;
    const isWide = width > 10;

    if (isChord) {
        const ends = y + tone.offset / 2 + 0.25 * tone.tie;
        let middle = 0;
        if (isWide) {
            middle = ends + (!isOnLine ? 0.75 : 0.5) * tone.tie;
        } else {
            middle = ends + 0.5 * tone.tie;
        }
        return { ends, middle };
    } else {
        const ends = y + tone.offset / 2 + 0.75 * tone.tie;
        let middle = 0;
        if (isWide) {
            middle = ends + (isOnLine ? 0.75 : 0.5) * tone.tie;
        } else {
            middle = ends + 0.5 * tone.tie;
        }
        return { ends, middle };
    }
}

function tiePointsX(
    x: number,
    tone: ToneDetails,
    stemDirection: Direction,
    glyphWidth: number,
    tieWidth: number,
    isChord: boolean
) {
    if (isChord) {
        let start = x + glyphWidth + 0.2;
        let end = x + tieWidth - 0.2;

        if (tone.isShunt) {
            if (stemDirection === Direction.up) {
                start += glyphWidth;
                end += glyphWidth;
            } else {
                start -= glyphWidth;
                end -= glyphWidth;
            }
        }

        const width = end - start;
        const middle = start + width / 2;
        return { start, middle, end, width };
    } else {
        const start = x + glyphWidth / 2 + 0.1;
        const end = x + tieWidth + glyphWidth / 2 - 0.1;
        const width = end - start;
        const middle = start + width / 2;
        return { start, middle, end, width };
    }
}

export function drawTie(
    x: number,
    y: number,
    tone: ToneDetails,
    stemDirection: Direction,
    glyphWidth: number,
    isChord: boolean,
    noteGap: number, // distance from start of note spacing to begingin of next notes spacing
    key: string
) {
    const instructions = [];
    if (tone.tie !== Direction.none) {
        const pointsX = tiePointsX(x, tone, stemDirection, glyphWidth, noteGap, isChord);
        const pointsY = tiePointsY(y, tone, pointsX.width, isChord);

        instructions.push(
            buildCurve(
                `${key}-tie`,
                { color: "#000000" },
                { x: pointsX.start, y: pointsY.ends, thickness: 0.125 },
                { x: pointsX.middle, y: pointsY.middle, thickness: 0.2 },
                { x: pointsX.end, y: pointsY.ends, thickness: 0.125 }
            )
        );
    }
    return instructions;
}
