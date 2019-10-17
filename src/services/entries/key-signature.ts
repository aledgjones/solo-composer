import shortid from 'shortid';
import { Entry, EntryType } from ".";

export enum KeySignatureMode {
    major = 1,
    minor
}

export interface KeySignatureDef {
    mode: KeySignatureMode;
    offset: number;
}

export interface KeySignature extends KeySignatureDef {

}

export function createKeySignature(def: KeySignatureDef, tick: number): Entry<KeySignature> {
    return {
        _type: EntryType.key,
        _key: shortid(),
        _box: { width: 1, height: 1 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}