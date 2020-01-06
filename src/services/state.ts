import { useReducer, useMemo } from "react";

import { TabState, tabReducer, tabEmptyState, tabActions, TabActions } from "./tab";
import { scoreActions, scoreReducer, scoreEmptyState, Score, ScoreActions } from "./score";
import { PlaybackState, PlaybackActions, playbackReducer, playbackEmptyState, playbackActions } from "./playback";

// import { log } from "../ui/utils/log";

export interface State {
    tab: TabState;
    score: Score;
    playback: PlaybackState;
}

export interface Actions {
    tab: TabActions;
    score: ScoreActions;
    playback: PlaybackActions;
}

export const useAppState = (): [State, Actions] => {
    const [state, dispatch] = useReducer(
        (_state: State, action): State => {
            return {
                tab: tabReducer(_state.tab, action),
                score: scoreReducer(_state.score, action),
                playback: playbackReducer(_state.playback, action)
            }
        },
        {
            tab: tabEmptyState(),
            score: scoreEmptyState(),
            playback: playbackEmptyState()
        }
    );

    const actions = useMemo((): Actions => {
        return {
            tab: tabActions(dispatch),
            score: scoreActions(dispatch),
            playback: playbackActions(dispatch)
        }
    }, [dispatch]);

    // log(state.playback, 'playback');

    return [state, actions];
}