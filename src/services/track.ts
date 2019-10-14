import shortid from 'shortid';
import { Entry } from './entries';

export type TrackKey = string;

export interface Tracks {
    order: TrackKey[];
    byKey: {
        [trackKey: string]: Track;
    }
};

export interface Track {
    key: TrackKey;
    entriesOrder: [];
    entriesByKey: {
        [entryKey: string]: Entry<any>;
    };
}

export function createTrack(trackKey: TrackKey = shortid()): Track {
    return {
        key: trackKey,
        entriesOrder: [],
        entriesByKey: {}
    }
}