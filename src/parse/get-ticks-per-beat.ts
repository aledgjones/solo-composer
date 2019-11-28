import { Entry } from "../entries";
import { TimeSignature } from "../entries/time-signature";

export function getTicksPerBeat(sig?: Entry<TimeSignature>) {
    if (!sig) {
        return 12;
    } else {
        return sig.subdivisions / (sig.beatType / 4);
    }
}