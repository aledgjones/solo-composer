import { EntriesByTick } from "../services/track";
import { NotationTrack, Notation, NotationType } from "./notation-track";
import { getNearestEntryToTick } from "./get-time-signature-at-tick";
import { TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { getTicksPerBeat } from "./get-ticks-per-beat";
import { getBeatGroupingBoundries } from "./get-beat-group-boundries";
import { getDistanceFromBarline } from "./get-distance-from-barline";
import { getIsBeatGroupingEmpty } from "./get-is-beat-grouping-empty";
import { getIsBeat } from "./get-is-beat";
import { getMiddleOfBar } from "./get-is-middle-of-bar";
import { getIsHalfBarEmpty } from "./get-is-half-bar-empty";
import { getIsWholeBarEmpty } from "./get-is-whole-bar-empty";
import { getCurrentBeatGroupingIndex } from "./get-current-beat-grouping-index";

function seperateAtSplits(event: Notation, start: number, splits: number[]) {

    let out: NotationTrack = {};
    let remainingDuration = event.duration;
    for (let i = splits.length - 1; i >= 0; i--) {
        const split = splits[i];
        const duration = start + remainingDuration - split;

        out[split] = {
            ...event,
            ties: i < splits.length - 1 ? event.keys : [],
            duration
        }

        remainingDuration -= duration;
    }
    return out;
}

function splitEventPerMeter(start: number, event: Notation, flow: EntriesByTick): NotationTrack {

    const stop = start + event.duration;
    const splits = [start];

    // split in preparation for conversion to note values
    // we never need to do anything on the first tick so add one to the start tick of the loop
    for (let tick = start + 1; tick < stop; tick++) {

        const foundTimeSig = getNearestEntryToTick<TimeSignature>(start, flow, EntryType.timeSignature);
        const timeSigAt = foundTimeSig ? foundTimeSig.at : 0;
        const timeSig = foundTimeSig && foundTimeSig.entry;
        const ticksPerBeat = getTicksPerBeat(timeSig);

        const distanceFromBarline = getDistanceFromBarline(tick, ticksPerBeat, timeSigAt, timeSig);
        const beatGroupingBoundries = getBeatGroupingBoundries(tick, ticksPerBeat, timeSigAt, timeSig);
        const currentBeatGroupingIndex = getCurrentBeatGroupingIndex(tick, beatGroupingBoundries);
        const middleOfBar = getMiddleOfBar(beatGroupingBoundries);

        const isBeat = getIsBeat(tick, ticksPerBeat, timeSigAt);
        const isFirstBeat = distanceFromBarline === 0;
        const isMiddleOfBar = tick === middleOfBar;
        const isBeatGroupingBoundry = beatGroupingBoundries.includes(tick);

        const isWholeBarEmpty = getIsWholeBarEmpty(start, stop, beatGroupingBoundries);
        const isbeatGroupingEmpty = getIsBeatGroupingEmpty(start, stop, currentBeatGroupingIndex, beatGroupingBoundries);
        const isHalfBarEmpty = getIsHalfBarEmpty(start, stop, tick, beatGroupingBoundries);

        if (!timeSig || timeSig.beats === 0) {
            // I haven't done this yet
        } else {

            // REST + NOTE SPLIT RULES

            if (isFirstBeat) {
                splits.push(tick);
            }

            if (event.type === NotationType.rest) {
                // REST SPLIT RULES

                if (!isWholeBarEmpty) {

                    if (timeSig.groupings.length === 3) {
                        if (isBeatGroupingBoundry) {
                            splits.push(tick);
                        }
                    } else {
                        if (isMiddleOfBar) {
                            splits.push(tick);
                        } else if (!isHalfBarEmpty && isBeatGroupingBoundry) {
                            splits.push(tick);
                        } else if (!isbeatGroupingEmpty && isBeat) {
                            splits.push(tick);
                        }
                    }

                }

            } else {

                // NOTE SPLIT RULES

                if (!isWholeBarEmpty) {

                    if (timeSig.groupings.length === 3) {
                        if (isMiddleOfBar && splits.length < 2) {
                            splits.push(tick);
                        } else if (isBeatGroupingBoundry) {
                            splits.push(tick);
                        }
                        // if(!isbeatGroupingEmpty && isBeatGroupingBoundry) {
                        //     splits.push(tick);
                        // } else 
                    } else {
                        if (isMiddleOfBar) {
                            splits.push(tick);
                        }
                    }
                }

            }
        }

    }

    return seperateAtSplits(event, start, splits);

}

export function splitAsPerMeter(flow: EntriesByTick, rhythmTrack: NotationTrack) {

    const events = Object.keys(rhythmTrack);
    const output = events.reduce((track: NotationTrack, startTickStr: string) => {

        const startTick = parseInt(startTickStr);
        const event = track[startTick];

        const out = {
            ...track,
            ...splitEventPerMeter(startTick, event, flow)
        }

        return out;

    }, rhythmTrack);

    return output;
}