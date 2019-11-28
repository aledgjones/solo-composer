export type EntryKey = string;

export interface Box {
    width: number;
    height: number;
}

export interface Offset {
    top: number;
    left: number;
}

export interface Entries {
    [entryKey: string]: Entry<any>;
}

export type Entry<T> = T & {
    _type: EntryType,
    _key: EntryKey;
    _box: Box;
    _bounds: Box;
    _offset: Offset;
    _tick: number
}

// the order is VERY important, if there is more than one entry at a certain point
// they will be ordered by their type number
export enum EntryType {
    barline = 1,
    clef,
    keySignature,
    timeSignature,
    tone,

    // not drawn
    subdivisionChange
}