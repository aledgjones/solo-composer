import { EntryKey, Entry } from "../entries";
import { Tone } from "../entries/tone";

export enum NotationBaseDuration {
    semiquaver = 0.25,
    quaver = 0.5,
    crotchet = 1,
    minim = 2,
    semibreve = 4,
    breve = 8
}

export interface Notation {
    key: string;
    tones: Entry<Tone>[]; // these may be repeated if a tone is split up into ties notes
    duration: number;
    ties: EntryKey[];
}

export interface NotationTrack {
    [tick: number]: Notation;
}

export interface NotationTracks {
    [trackKey: string]: NotationTrack;
}

export function getNotationBaseDuration(
    duration: number,
    subdivisions: number
): NotationBaseDuration | undefined {
    const length = duration / subdivisions;
    if (NotationBaseDuration[length]) {
        return length;
    } else {
        const baseLength = (length / 3) * 2;
        if (NotationBaseDuration[baseLength]) {
            return baseLength;
        } else {
            return undefined;
        }
    }
}

export function getIsDotted(duration: number, subdivisions: number): boolean {
    const length = duration / subdivisions;
    if (NotationBaseDuration[length]) {
        return false;
    } else {
        const baseLength = (length / 3) * 2;
        if (NotationBaseDuration[baseLength]) {
            return true;
        } else {
            return false;
        }
    }
}
