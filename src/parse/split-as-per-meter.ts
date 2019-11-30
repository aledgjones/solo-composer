import { NotationTrack, NotationType } from "./notation-track";
import { EntriesByTick } from "../services/track";
import { EntryType } from "../entries";
import { getNearestEntryToTick } from "./get-nearest-entry-to-tick";
import { getTicksPerBeat } from "./get-ticks-per-beat";
import { TimeSignature } from "../entries/time-signature";
import { getIsEmpty } from "./get-is-empty";
import { spltNotationTrack, Splits } from "./split-notation-track";
import { getDefaultGroupings } from "./get-default-groupings";
import { getIsWritable } from "./get-is-writable";
import { getBeatGroupingBoundries } from "./get-beat-group-boundries";
import { getNearestNotationToTick } from "./get-nearest-notation-to-tick";

function getNextGroupingAndBeat(grouping: number, beatType: number) {

    switch (grouping) {
        case 2:
            return { groupings: [1, 1, 1, 1], beatType: beatType * 2 };
        case 3:
            return { groupings: [1, 1, 1], beatType: beatType };
        case 4:
            return { groupings: [1, 1, 1, 1], beatType: beatType };

        case 1:
        default:
            return { groupings: [1, 1, 1, 1], beatType: beatType * 4 };
    }

}

export function splitUnit(start: number, stop: number, subdivisions: number, originalBeatType: number, beatType: number, groupings: number[], track: NotationTrack, isFullBar: boolean): Splits {
    let splits: Splits = {};

    const originalTicksPerBeat = getTicksPerBeat(subdivisions, originalBeatType);
    const ticksPerBeat = getTicksPerBeat(subdivisions, beatType);
    const groupingBoundries = getBeatGroupingBoundries(start, ticksPerBeat, groupings);
    const lastGrouping = groupingBoundries[groupingBoundries.length - 2];
    const longestDottedRest = ((originalTicksPerBeat / 2) / 2) * 3;

    // if the unit is empty we stop the reccursion as there is no need for higher fidelity
    const unitIsEmpty = getIsEmpty(start, stop, track);
    if (unitIsEmpty) {

        // we will use semi-breve rest for all full bars
        if (isFullBar && track[start].type !== NotationType.rest && !getIsWritable(track[start].duration, subdivisions)) {
            splits[lastGrouping] = true;
        }

        return splits;

    } else {

        if (groupings.length === 2) {

            const middle = groupingBoundries[1];
            const found = getNearestNotationToTick(middle, track);

            if (found) {
                if (found.at !== middle) {
                    splits[middle] = true;
                }
            }

        }

        if (groupings.length === 3) {

            // split all rests at beats
            for (let i = 0; i < groupingBoundries.length; i++) {
                const boundry = groupingBoundries[i];
                const found = getNearestNotationToTick(boundry, track);
                if (found && found.at !== boundry && found.entry.type === NotationType.rest) {
                    splits[boundry] = true;
                }
            }

            // make sure it doesn't look compound! (c. at end of bar) 
            const middle = (stop - start) / 2;
            if (track[middle] && getIsEmpty(middle, stop, track)) {
                splits[groupingBoundries[2]] = true;
            };

            // sustain two beats into a none
            if (!getIsEmpty(groupingBoundries[0], groupingBoundries[1], track)) {
                splits[groupingBoundries[1]] = true;
            }

            // if we haven't made any splits we split at the first boundry
            if (Object.keys(splits).length === 0 && !track[groupingBoundries[1]] && !track[groupingBoundries[2]]) {
                splits[groupingBoundries[2]] = true;
            }

        }

        if (groupings.length === 4) {

            const middle = groupingBoundries[2];
            const found = getNearestNotationToTick(middle, track);

            if (found) {
                if (found.entry.type === NotationType.rest) {
                    const durationRemaining = found.entry.duration - (groupingBoundries[0] - found.at);
                    if (durationRemaining !== longestDottedRest && found.at !== middle) {
                        splits[middle] = true;
                    }
                }
            }

        }

        groupingBoundries.forEach((curr, i) => {
            const next = groupingBoundries[i + 1];
            if (next) {
                const grouping = groupings[i];
                const { groupings: nextGroupings, beatType: nextBeatType } = getNextGroupingAndBeat(grouping, beatType);
                splits = {
                    ...splits,
                    ...splitUnit(curr, next, subdivisions, originalBeatType, nextBeatType, nextGroupings, track, false)
                }
            }
        });

    }

    return splits;
}

export function splitAsPerMeter(length: number, flow: EntriesByTick, track: NotationTrack, barlines: number[]) {

    // split at barlines
    track = spltNotationTrack(length, track, barlines.reduce<Splits>((out, tick) => ({ ...out, [tick]: true }), {}));

    let splits: Splits = {};

    barlines.forEach((barline, i) => {
        const start = barline;
        const stop = barlines[i + 1] || length;

        const foundTimeSig = getNearestEntryToTick<TimeSignature>(start, flow, EntryType.timeSignature);
        const timeSig = foundTimeSig && foundTimeSig.entry;
        const groupings = timeSig ? timeSig.groupings : getDefaultGroupings(0);
        const subdivisions = timeSig ? timeSig.subdivisions : 12;
        const beatType = timeSig ? timeSig.beatType : 4;

        splits = {
            ...splits,
            ...splitUnit(start, stop, subdivisions, beatType, beatType, groupings, track, true)
        }
    });

    const result = spltNotationTrack(length, track, splits);

    // console.log(track, '\n', result, '\n', splits);

    return result;
}