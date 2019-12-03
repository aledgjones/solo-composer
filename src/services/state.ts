import { useReducer, useMemo, useCallback } from "react"
import { TabState, tabReducer, tabEmptyState, tabActions, TabActions } from "./tab";
import { scoreActions, scoreReducer, scoreEmptyState, Score, ScoreActions } from "./score";
import { log } from "../ui/utils/log";

const LOGGING = false;

export interface State {
    tab: TabState;
    score: Score;
}

export interface Actions {
    tab: TabActions;
    score: ScoreActions;
}

export const useAppState = (): [State, Actions] => {
    const [state, _dispatch] = useReducer(
        (_state: State, action): State => {
            return {
                tab: tabReducer(_state.tab, action),
                score: scoreReducer(_state.score, action)
            }
        },
        {
            tab: tabEmptyState(),
            score: scoreEmptyState()
        }
    );

    // add logging to dispatch
    const dispatch = useCallback((action: any) => {
        if (LOGGING) {
            console.log(action.type, action.payload);
        }
        _dispatch(action);
    }, [_dispatch]);

    const actions = useMemo((): Actions => {
        return {
            tab: tabActions(dispatch),
            score: scoreActions(dispatch)
        }
    }, [dispatch]);

    if (LOGGING) {
        log(state, 'state');
    }

    return [state, actions];
}