import { Track, entriesByTick } from "./track";
import { getEntriesAtTick } from "../parse/get-entry-at-tick";
import { Entry, EntryType } from "../entries";

/**
 * Assign an entry to a track, replacing an existing entry of the same type if present already
 */
export function assignEntryToTrack<T>(track: Track, entry: Entry<T>, entryType: EntryType) {
    // if there is already a time sig at tick, replace with new entry
    const entries = entriesByTick(track.entries.order, track.entries.byKey);
    const old = getEntriesAtTick<T>(entry._tick, entries, entryType).entries[0];
    if (old) {
        entry._key = old._key;
    } else {
        track.entries.order.push(entry._key);
    }
    track.entries.byKey[entry._key] = entry;
}
