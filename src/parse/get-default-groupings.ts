import { TimeSignatureType, getTimeSignatureType } from "./get-time-signature-type";

export function getDefaultGroupings(beats: number) {
    const type = getTimeSignatureType(beats);

    if (beats === 0) {
        return [2, 2];
    }

    if (beats <= 3) {
        return Array(beats).fill(1);
    }

    switch (type) {
        case TimeSignatureType.simple:
            return Array(beats / 2).fill(2);
        case TimeSignatureType.compound:
            return Array(beats / 3).fill(3);
        case TimeSignatureType.complex: {
            let out = [];
            let remaining = beats;
            while (remaining > 4) {
                out.push(3);
                remaining = remaining - 3;
            }
            out.push(remaining);
            return out;
        }
        default:
            return Array(beats).fill(1);
    }
}