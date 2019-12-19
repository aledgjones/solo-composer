export function getDistanceFromBarline(tick: number, ticksPerBeat: number, sigAt: number = 0, beats: number = 0) {
    if (beats === 0) {
        // treat it like 4/4 for splitting etc;
        return (tick - sigAt) % (12 * 8);
    }

    return (tick - sigAt) % (ticksPerBeat * beats);
}