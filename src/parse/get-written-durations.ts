import { entriesByTick, EntriesByTick } from "../services/track";
import { Stave } from "../services/stave";
import { NotationTrack } from "./notation-track";
import { notateTones } from "./notate-tones";
import { splitAsPerMeter } from "./split-as-per-meter";

/**
 * Convert tones into written notaition values
 */
export function getWrittenDurations(length: number, flowEntriesByTick: EntriesByTick, staves: Stave[], barlines: number[]) {

    return staves.reduce((output: { [key: string]: NotationTrack }, stave) => {
        stave.tracks.order.forEach(trackKey => {

            const track = stave.tracks.byKey[trackKey];
            const trackEventsByTick = entriesByTick(track.entries.order, track.entries.byKey);

            let notationTrack = {};
            notationTrack = notateTones(length, trackEventsByTick, notationTrack);
            notationTrack = splitAsPerMeter(length, flowEntriesByTick, notationTrack, barlines);

            output[trackKey] = notationTrack;

        });

        return output;
    }, {});
}