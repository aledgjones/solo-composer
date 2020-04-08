import { useMemo } from "react";
import { Store, useStoreState } from "pullstate";

import { uiEmptyState, uiActions, UiState } from "./ui";
import { scoreActions, scoreEmptyState, Score } from "./score";
import { PlaybackState, playbackEmptyState, playbackActions } from "./playback";

export interface State {
    ui: UiState;
    score: Score;
    playback: PlaybackState;
}

const store = new Store<State>({
    ui: uiEmptyState(),
    score: scoreEmptyState(),
    playback: playbackEmptyState()
});

export function useAppActions() {
    return useMemo(() => {
        return {
            ui: uiActions(store),
            score: scoreActions(store),
            playback: playbackActions(store)
        }
    }, []);
}

export function useAppState<T>(sub: (state: State) => T, deps?: any[]) {
    return useStoreState<State, T>(store, sub, deps);
}