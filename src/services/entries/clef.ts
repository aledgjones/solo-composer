import { Entry, EntryDef, EntryKey } from ".";

export enum ClefType {
    C = 1,
    F,
    G
}

export interface ClefDef extends EntryDef {
    type: ClefType;
    offset: number;
}

export class Clef implements Entry<ClefDef> {

    public key: EntryKey;
    
    private type: ClefType;
    private offset: number;

    constructor(def: ClefDef, key: EntryKey) {
        this.key = key;
        this.type = def.type;
        this.offset = def.offset;
    }

    public measure() {
        return { width: 100 };
    }

    public def() {
        return { _type: 'clef', type: this.type, offset: this.offset };
    }
}