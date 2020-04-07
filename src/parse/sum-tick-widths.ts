export function sumTickWidths(from: number, to: number, horizontalMeasurements: number[][]) {
    let total = 0;
    for (let i = from; i < to; i++) {
        // its possible we have got to the end of the track so ignore any measuremenets
        // that don't exist and areturn 0
        if (horizontalMeasurements[i]) {
            total = total + horizontalMeasurements[i].reduce((out, width) => {
                out = out + width;
                return out;
            }, 0);
        }
    }
    return total;
}
