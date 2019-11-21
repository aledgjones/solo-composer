import { TimeSignature } from "../entries/time-signature";
import { Entry } from "../entries";

export enum TimeSignatureType {
    compound,
    simple,
    complex
}

export function getTimeSignatureType(sig: Entry<TimeSignature>) {
    if (sig.beats >= 6 && sig.beats % 3 === 0) {
        return TimeSignatureType.compound;
    } else if (sig.beats === 1 || sig.beats === 3 || sig.beats % 2 === 0) {
        return TimeSignatureType.simple;
    } else {
        return TimeSignatureType.complex;
    }
}