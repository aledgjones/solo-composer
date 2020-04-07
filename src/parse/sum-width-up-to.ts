export enum WidthOf {
    endRepeat,
    clef,
    barline,
    key,
    time,
    startRepeat,
    accidentals,
    preNoteSlot,
    noteSpacing,
    end
}

export function sumWidthUpTo(widths: number[], upTo: WidthOf) {
    let sum = 0;
    // its possible we have got to the end of the track so ignore any measurements
    // that don't exist and return 0
    if (widths) {
        for (let i = 0; i < upTo; i++) {
            sum += widths[i];
        }
    }
    return sum;
}
