import { EntryKey, Entry } from "../entries";
import { Tone } from "../entries/tone";

export enum NotationBaseLength {
    semiquaver = .25,
    quaver = .5,
    crotchet = 1,
    minim = 2,
    semibreve = 4,
    breve = 8
}

export interface Notation {
    key: string;
    tones: Entry<Tone>[] // these may be repeated if a tone is split up into ties notes
    duration: number;
    ties: EntryKey[];
}

export interface NotationTrack {
    [tick: number]: Notation;
}

export interface NotationTracks {
    [trackKey: string]: NotationTrack;
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