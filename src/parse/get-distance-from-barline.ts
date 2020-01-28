export function getDistanceFromBarline(tick: number, ticksPerBeat: number, sigAt: number = 0, beats: number = 4) {
    return (tick - sigAt) % (ticksPerBeat * beats);
}