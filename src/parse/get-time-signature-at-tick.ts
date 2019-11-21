import { EntriesByTick } from "../services/track";
import { Entry, EntryType } from "../entries";

export function getNearestEntryToTick<T>(_tick: number, track: EntriesByTick, type?: EntryType): { at: number, entry: Entry<T> } | undefined {

    for (let tick = _tick; tick >= 0; tick--) {

        const trackEntries = track[tick] || [];
        for (let entry of trackEntries) {
            if (!type || entry._type === type) {
                return {
                    at: tick,
                    entry: entry
                }
            }
        }

    }
}