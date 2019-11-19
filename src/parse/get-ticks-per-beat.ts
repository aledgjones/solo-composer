export function getTicksPerBeat(subdivisions: number, beat: number) {
    return subdivisions / (beat / 4);
}