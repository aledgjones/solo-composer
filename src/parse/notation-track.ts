import { EntryKey } from "../entries";

export enum NotationType {
    rest,
    note,
    barline
}

export interface Notation {
    keys: EntryKey[] // these may be repeated if a tone is split up into ties notes
    duration: number;
    type: NotationType;
    ties: EntryKey[];
}

export interface NotationTrack {
    [tick: number]: Notation;
}