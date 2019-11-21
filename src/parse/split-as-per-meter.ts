import { EntriesByTick } from "../services/track";
import { RhythmTrack, Rhythm } from "./rhythm-track";
import { getNearestEntryToTick } from "./get-time-signature-at-tick";

export function splitAsPerMeter(subdivisions: number, flow: EntriesByTick, rhythmTrack: RhythmTrack) {

    const events = Object.keys(rhythmTrack);

    events.forEach((startTickStr) => {

        const startTick = parseInt(startTickStr);
        const event = rhythmTrack[startTick];
        const stopTick = startTick + event.duration;
        const splits: number[] = [];

        // split in preparation for conversion to note values
        // we never need to do anything on the first tick so add one to the start tick of the loop
        for (let tick = startTick + 1; tick < stopTick; tick++) {
            const foundSig = getNearestEntryToTick(startTick, flow);
        }


        // APLLY THE SPLITS HERE
        // let prev: Rhythm = event;
        // let prevTick = startTick;

        // splits.forEach(split => {
        //     const next = { keys: prev.keys, duration: stopTick - prevTick, type: prev.type, ties: [] };
        //     rhythmTrack[split] = next

        //     prev.ties = prev.keys;
        //     prev.duration = startTick + split;
        // });

    });

    return rhythmTrack;
}