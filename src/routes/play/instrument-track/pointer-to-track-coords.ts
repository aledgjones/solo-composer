import { toMidiPitchString } from "../../../playback/utils";
import { Tick } from "../ticks/defs";
import { Direction } from "../../../parse/get-stem-direction";

export function getPitchFromYPosition(y: number, highestPitch: number, slotHeight: number) {
    const lowestPitch = highestPitch - 23;
    const base = highestPitch;
    const slot = Math.floor(y / slotHeight);
    const pitch = base - slot;

    // avoid dragging beyond the bounds of the track.
    if (pitch > highestPitch) {
        return toMidiPitchString(highestPitch);
    } else if (pitch < lowestPitch) {
        return toMidiPitchString(lowestPitch);
    } else {
        return toMidiPitchString(pitch);
    }
}

export function getTickFromXPosition(x: number, ticks: Tick[], snap: number, round: Direction) {
    for (let i = 0; i < ticks.length; i++) {
        const tick = ticks[i];
        if (tick.x > x) {
            // we have overshot, it is in the previous tick
            const index = i - 1;
            const lowerSnapTick = index - (index % snap);
            const higherSnapTick = lowerSnapTick + snap;
            const middleOfSnap =
                ticks[lowerSnapTick].x + (ticks[higherSnapTick].x - ticks[lowerSnapTick].x) / 2;

            if (round === Direction.down) {
                return lowerSnapTick;
            }

            if (round === Direction.up) {
                return higherSnapTick;
            }

            if (x < middleOfSnap) {
                return lowerSnapTick;
            }

            if (x >= middleOfSnap) {
                return higherSnapTick;
            }
        }
    }
    return ticks[ticks.length - 1].x + snap;
}
