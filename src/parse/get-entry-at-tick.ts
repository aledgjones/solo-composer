import { EntriesByTick } from "../services/track";
import { EntryType, Entry } from "../entries";

export function getEntriesAtTick<T>(tick: number, track: EntriesByTick, type?: EntryType) {
    const trackEntries = track[tick] || [];
    const entries: Entry<T>[] = trackEntries.filter(entry => {
        return !type || entry._type === type;
    });
    return {
        at: tick,
        entries
    }
}