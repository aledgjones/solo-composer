export function getIsBeat(tick: number, ticksPerBeat: number = 0, sigAt: number = 0) {
    if (ticksPerBeat === 0) {
        return false;
    } else {
        return (tick - sigAt) % ticksPerBeat === 0;
    }
}
