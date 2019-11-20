import { EntryKey } from "../entries";

export enum DurationType {
    rest,
    note,
    barline
}

export interface Rhythm {
    keys: EntryKey[] // these may be repeated if a tone is split up into ties notes
    duration: number;
    type: DurationType;
    ties: EntryKey[];
}

export interface RhythmTrack {
    [tick: number]: Rhythm;
}