import shortid from 'shortid';
import { Entry, EntryType } from ".";

export enum ClefType {
    C = 1,
    F,
    G
}

export interface ClefDef {
    type: ClefType;
    position: number;
}

export interface Clef extends Entry, ClefDef {

}

export function createClef(def: ClefDef): Clef {
    return {
        _type: EntryType.clef,
        _key: shortid(),
        _box: { width: 1, height: 1 },
        _offset: { top: 0, left: 0 },

        ...def
    }
}