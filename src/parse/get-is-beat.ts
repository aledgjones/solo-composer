export function getIsBeat(tick: number, ticksPerBeat: number, sigAt: number) {
    return (tick - sigAt) % ticksPerBeat === 0;
}