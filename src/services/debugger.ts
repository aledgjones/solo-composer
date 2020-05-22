import { useLog } from "solo-ui";
import { useAppState } from "./state";

export function useDebugger() {
    const state = useAppState((s) => s);
    console.log(state.playback.sampler);
    // useLog(state, "state");
}
