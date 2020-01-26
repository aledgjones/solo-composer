import shortid from 'shortid';
import { EntryKey, Entries, Entry } from '../entries';

export type TrackKey = string;

export interface Tracks {
    [trackKey: string]: Track;
};

export interface Track {
    key: TrackKey;
    entries: {
        order: EntryKey[];
        byKey: Entries;
    }
}

export function createTrack(events: Entry<any>[]): Track {
    return {
        key: shortid(),
        entries: {
            order: events.map(e => e._key),
            byKey: events.reduce((out: { [key: string]: Entry<any> }, e) => {
                out[e._key] = e;
                return out;
            }, {})
        }
    }
}

export interface EntriesByTick {
    [tick: number]: Entry<any>[]
}

export function entriesByTick(entriesOrder: EntryKey[], entriesByKey: Entries): EntriesByTick {
    return entriesOrder.reduce((out: EntriesByTick, entryKey) => {
        const entry: Entry<any> = entriesByKey[entryKey];
        if (out[entry._tick]) {
            out[entry._tick].push(entry);
        } else {
            out[entry._tick] = [entry];
        }
        return out;
    }, {});
}