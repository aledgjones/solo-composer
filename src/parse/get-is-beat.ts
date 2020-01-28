export function getIsBeat(tick: number, ticksPerBeat: number, sigAt: number = 0) {
    return (tick - sigAt) % ticksPerBeat === 0;
}