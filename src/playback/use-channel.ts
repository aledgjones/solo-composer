import { InstrumentKey } from "../services/score-instrument";
import { useAppState } from "../services/state";

export function usePatches(instrumentKey: InstrumentKey) {
    return useAppState(
        (s) => {
            const order = s.playback.sampler.channels.order;
            for (let i = 0; i < order.length; i++) {
                const channelKey = order[i];
                const channel = s.playback.sampler.channels.byKey[channelKey];
                if (channel && channel.assigned === instrumentKey) {
                    return channel.patches.byKey;
                }
            }
        },
        [instrumentKey]
    );
}
