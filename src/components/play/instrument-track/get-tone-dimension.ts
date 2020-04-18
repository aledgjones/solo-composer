import { Entry } from "../../../entries";
import { toMidiPitchNumber, Pitch } from "../../../playback/utils";
import { Tone } from "../../../entries/tone";
import { Tick } from "../ticks/defs";

export const SLOT_HEIGHT = 224 / 24;

function getTop(pitch: Pitch, highestPitch: number) {
    const value = toMidiPitchNumber(pitch);
    return (highestPitch - value) * SLOT_HEIGHT;
}

function getLeft(tick: number, ticks: Tick[]) {
    return ticks[tick].x
}

function getWidth(start: number, duration: number, ticks: Tick[]) {
    let width = 0;
    for (let i = start; i < start + duration; i++) {
        width += ticks[i].width;
    }
    return width;
}

export function getToneDimensions(highestPitch: number, entry: Entry<Tone>, ticks: Tick[]) {
    return [getTop(entry.pitch, highestPitch), getLeft(entry._tick, ticks), getWidth(entry._tick, entry.duration, ticks)];
}