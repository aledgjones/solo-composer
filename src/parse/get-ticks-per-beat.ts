import { Entry } from "../entries";
import { TimeSignature } from "../entries/time-signature";

export function getTicksPerBeat(subdivisions: number, sig?: Entry<TimeSignature>) {
    if (!sig) {
        return subdivisions;
    } else {
        return subdivisions / (sig.beatType / 4);
    }
}