import { EntryKey } from "../entries";

export enum NotationType {
    rest,
    note
}

export enum NotationBaseLength {
    semiquaver = .25,
    quaver = .5,
    crotchet = 1,
    minim = 2,
    semibreve = 4,
    breve = 8
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

export function getNotationBaseLength(duration: number, subdivisions: number): NotationBaseLength | undefined {
    const length = duration / subdivisions;
    if (NotationBaseLength[length]) {
        return length;
    } else {
        const baseLength = (length / 3) * 2;
        if (NotationBaseLength[baseLength]) {
            return baseLength;
        } else {
            return undefined;
        }
    }
}

export function getIsDotted(duration: number, subdivisions: number): boolean {
    const length = duration / subdivisions;
    if (NotationBaseLength[length]) {
        return false;
    } else {
        const baseLength = (length / 3) * 2;
        if (NotationBaseLength[baseLength]) {
            return true;
        } else {
            return false;
        }
    }
}