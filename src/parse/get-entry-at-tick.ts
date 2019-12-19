import { EntriesByTick } from "../services/track";
import { EntryType, Entry } from "../entries";

export function getEntryAtTick<T>(tick: number, track: EntriesByTick, type?: EntryType) {


    const trackEntries = track[tick] || [];
    for (let entry of trackEntries) {
        if (!type || entry._type === type) {
            return {
                at: tick,
                entry: entry as Entry<T>
            }
        }
    }

    return { at: 0, entry: undefined };
}