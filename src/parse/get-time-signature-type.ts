export enum TimeSignatureType {
    compound,
    simple,
    complex,
    open
}

export function getTimeSignatureType(beats: number) {
    if (beats === 0) {
        return TimeSignatureType.open;
    } else if (beats >= 6 && beats % 3 === 0) {
        return TimeSignatureType.compound;
    } else if (beats === 1 || beats === 2 || beats === 3 || beats === 4) {
        return TimeSignatureType.simple;
    } else {
        return TimeSignatureType.complex;
    }
}
