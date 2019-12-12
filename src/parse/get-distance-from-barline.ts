export function getDistanceFromBarline(tick: number, ticksPerBeat: number, sigAt: number, beats: number = 0) {
    if (beats === 0) {
        return tick - sigAt;
    }

    return (tick - sigAt) % (ticksPerBeat * beats);
}