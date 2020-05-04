export enum ClefType {
    C = "C4",
    F = "F3",
    G = "G4"
}

export interface ClefDef {
    pitch: ClefType;
    offset: number;
}

export interface Clef extends ClefDef {}
