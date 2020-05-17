export function getTicksPerBeat(subdivisions: number, beatType: number = 4) {
    return subdivisions / (beatType / 4);
}
