export enum ClefType {
    C = 1,
    F,
    G
}

export interface ClefDef {
    type: ClefType;
    offset: number;
}

export interface Clef extends ClefDef { }