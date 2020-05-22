import { useMemo } from "react";
import { Store, useStoreState } from "pullstate";

import { uiEmptyState, uiActions, UiState } from "./ui";
import { scoreActions, scoreEmptyState, Score } from "./score";
import { PlaybackState, playbackEmptyState, playbackActions } from "./playback";
import { appEmptyState, AppState, appActions } from "./app";

export interface State {
    ui: UiState;
    app: AppState;
    score: Score;
    playback: PlaybackState;
}

export const store = new Store<State>({
    ui: uiEmptyState(),
    app: appEmptyState(),
    score: scoreEmptyState(),
    playback: playbackEmptyState()
});

export function useAppActions() {
    return useMemo(() => {
        return {
            ui: uiActions(store), // user interface things (ephermeral)
            app: appActions(store), // app wide preferences and actions
            score: scoreActions(store), // score specific preferences and data
            playback: playbackActions(store) // pl
        };
    }, []);
}

export function useAppState<T>(sub: (state: State) => T, deps?: any[]) {
    return useStoreState<State, T>(store, sub, deps);
}
