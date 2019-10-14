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
    [entryKey: string]: Entry;
}

export interface Entry {
    _type: EntryType,
    _key: EntryKey;
    _box: Box;
    _offset: Offset;
}

export enum EntryType {
    clef = 1,
    key
}