export enum ClefType {
    C = 'C',
    F = 'F',
    G = 'G'
}

export interface ClefDef {
    type: ClefType;
    offset: number;
}

export interface Clef extends ClefDef { }