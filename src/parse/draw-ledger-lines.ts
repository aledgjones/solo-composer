import { Direction } from "./get-stem-direction";
import { ToneDetails } from "./draw-tick";
import { buildPath } from "../render/path";
import { getNoteheadWidthFromDuration } from "./get-notehead-width-from-duration";
import { NotationBaseDuration } from "./notation-track";

export function drawLedgerLines(
    x: number,
    y: number,
    details: ToneDetails[],
    duration: NotationBaseDuration | undefined,
    stemDirection: Direction,
    key: string
) {
    const instructions: any = [];

    const highLedgerLines: Array<0 | 1 | 2> = [0];
    const lowLedgerLines: Array<0 | 1 | 2> = [0, 0, 0, 0, 0];
    const noteheadWidth = getNoteheadWidthFromDuration(duration);

    // low notes
    for (let i = 0; i < details.length; i++) {
        const detail = details[i];

        const offset = detail.offset;
        for (let ii = 10; ii <= offset; ii++) {
            lowLedgerLines[Math.floor(ii / 2)] = detail.isShunt ? 2 : 1;
        }

        if (detail.isShunt) {
            break;
        }
    }

    lowLedgerLines.forEach((width, i) => {
        if (width > 0) {
            instructions.push(
                buildPath(
                    key + i,
                    { color: "#000000", thickness: 0.1875 },
                    [x - (width === 2 && stemDirection === Direction.down ? noteheadWidth : 0) - 0.4, y + i],
                    [
                        x + noteheadWidth + (width === 2 && stemDirection === Direction.up ? noteheadWidth : 0) + 0.4,
                        y + i
                    ]
                )
            );
        }
    });

    // high notes
    for (let i = details.length - 1; i >= 0; i--) {
        const detail = details[i];

        const offset = detail.offset;
        for (let ii = -2; ii >= offset; ii--) {
            highLedgerLines[Math.ceil(ii / 2) * -1] = detail.isShunt ? 2 : 1;
        }

        if (detail.isShunt) {
            break;
        }
    }

    highLedgerLines.forEach((width, i) => {
        if (width > 0) {
            instructions.push(
                buildPath(
                    key + i,
                    { color: "#000000", thickness: 0.1875 },
                    [x - (width === 2 && stemDirection === Direction.down ? noteheadWidth : 0) - 0.4, y - i],
                    [
                        x + noteheadWidth + (width === 2 && stemDirection === Direction.up ? noteheadWidth : 0) + 0.4,
                        y - i
                    ]
                )
            );
        }
    });

    return instructions;
}
