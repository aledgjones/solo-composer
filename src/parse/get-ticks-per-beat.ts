export function getTicksPerBeat(subdivisions: number, beatType: number) {
    return subdivisions / (beatType / 4);
}