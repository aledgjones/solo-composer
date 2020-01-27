export function getTicksPerBeat(subdivisions: number = 12, beatType: number = 4) {
    return subdivisions / (beatType / 4);
}