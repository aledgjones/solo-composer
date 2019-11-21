import { Entry } from "../entries";
import { TimeSignature } from "../entries/time-signature";
import { TimeSignatureType, getTimeSignatureType } from "./get-time-signature-type";

export function getGroupings(sig: Entry<TimeSignature>) {

    if (sig.beats <= 3) {
        return Array(sig.beats).fill(1);
    }

    const type = getTimeSignatureType(sig);
    switch (type) {
        case TimeSignatureType.simple:
            return Array(sig.beats / 2).fill(2);
        case TimeSignatureType.compound:
            return Array(sig.beats / 3).fill(3);
        case TimeSignatureType.complex: {
            let out = [];
            let len = sig.beats;
            while (len > 4) {
                out.push(3);
                len = len - 3;
            }
            console.log(len)
            out = out.concat(Array(len / 2).fill(2));
            return out;
        }
        default:
            return Array(sig.beats).fill(1);
    }
}