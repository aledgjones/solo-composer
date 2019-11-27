import { Entry } from "../entries";
import { TimeSignature } from "../entries/time-signature";

export function getDistanceFromBarline(tick: number, ticksPerBeat: number, sigAt: number, sig?: Entry<TimeSignature>) {
    if (!sig || sig.beats === 0) {
        return tick - sigAt;
    }

    return (tick - sigAt) % (ticksPerBeat * sig.beats);
}