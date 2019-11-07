import shortid from 'shortid';
import { EntryKey, Entries } from '../entries';

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

export function createTrack(entriesOrder: EntryKey[] = [], entriesByKey: Entries): Track {
    return {
        key: shortid(),
        entries: {
            order: entriesOrder,
            byKey: entriesByKey
        }
    }
}