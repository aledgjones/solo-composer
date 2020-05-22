import { useLog } from "solo-ui";
import { useAppState } from "../services/state";

export function useDebugger() {
    const state = useAppState((s) => s);
    useLog(state, "state");
}
