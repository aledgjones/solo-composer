import { EntriesByTick } from "../services/track";
import { EntryType } from "../entries";

export function getNearestEntryToTick<T>(tick: number, track: EntriesByTick, type?: EntryType) {

    for (let _tick = tick; _tick >= 0; _tick--) {

        const trackEntries = track[_tick] || [];
        for (let entry of trackEntries) {
            if (!type || entry._type === type) {
                return {
                    at: _tick,
                    entry: entry
                }
            }
        }

    }

    return { at: 0, entry: undefined }
}