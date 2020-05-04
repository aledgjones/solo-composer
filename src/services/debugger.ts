import { useLog } from "solo-ui";
import { useAppState } from "./state";

export function useDebugger() {
    const state = useAppState(s => s.score);
    useLog(state, "score");
}
