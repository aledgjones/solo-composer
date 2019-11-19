import shortid from 'shortid';
import { EntryKey, Entries, Entry } from '../entries';

export type TrackKey = string;

export interface Tracks {
    order: TrackKey[],
    byKey: {
        [trackKey: string]: Track;
    }
};

export interface Track {
    key: TrackKey;
    entries: {
        order: EntryKey[];
        byKey: Entries;
    }
}

export function createTrack(entriesOrder: EntryKey[] = [], entriesByKey: Entries): Track {
    return {
        key: shortid(),
        entries: {
            order: entriesOrder,
            byKey: entriesByKey
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