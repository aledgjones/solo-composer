import shortid from 'shortid';
import { Entry, EntryType } from ".";

export enum KeyMode {
    major = 1,
    minor
}

export interface KeyDef {
    mode: KeyMode;
    offset: number;
}

export interface Key extends Entry, KeyDef {

}

export function createClef(def: KeyDef): Key {
    return {
        _type: EntryType.key,
        _key: shortid(),
        _box: { width: 1, height: 1 },
        _offset: { top: 0, left: 0 },

        ...def
    }
}