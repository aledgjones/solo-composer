import { EntriesByTick } from "../services/track";
import { EntryType, Entry } from "../entries";

export function getNearestEntriesToTick<T>(tick: number, track: EntriesByTick, type?: EntryType) {
    for (let _tick = tick; _tick >= 0; _tick--) {
        const trackEntries = track[_tick] || [];
        const entries: Entry<T>[] = trackEntries.filter(entry => {
            return !type || entry._type === type;
        });
        if (entries.length > 0) {
            return { at: _tick, entries };
        }
    }

    return { at: 0, entries: [] };
}
