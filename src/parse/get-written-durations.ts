import { entriesByTick, EntriesByTick, Tracks } from "../services/track";
import { Stave } from "../services/stave";
import { NotationTracks } from "./notation-track";
import { notateTones } from "./notate-tones";
import { splitAsPerMeter } from "./split-as-per-meter";

/**
 * Convert tones into written notaition values
 */
export function getWrittenDurations(length: number, flowEntriesByTick: EntriesByTick, staves: Stave[], tracks: Tracks, barlines: number[]) {

    return staves.reduce<NotationTracks>((output, stave) => {
        stave.tracks.forEach(trackKey => {

            const track = tracks[trackKey];
            const trackEventsByTick = entriesByTick(track.entries.order, track.entries.byKey);

            let notationTrack = {};
            notationTrack = notateTones(length, trackEventsByTick, notationTrack);
            notationTrack = splitAsPerMeter(length, flowEntriesByTick, notationTrack, barlines);

            output[trackKey] = notationTrack;

        });

        return output;
    }, {});
}