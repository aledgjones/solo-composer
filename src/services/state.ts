import { useReducer, useMemo } from "react"
import { TabState, tabReducer, tabEmptyState, tabActions, TabActions } from "./tab";
import { scoreActions, scoreReducer, scoreEmptyState, ScoreState, ScoreActions } from "./score";
// import { log } from "../ui/utils/log";

export interface State {
    tab: TabState;
    score: ScoreState;
}

export interface Actions {
    tab: TabActions;
    score: ScoreActions;
}

export const useAppState = (): [State, Actions] => {
    const [state, dispatch] = useReducer(
        (state, action) => {
            return {
                tab: tabReducer(state.tab, action),
                score: scoreReducer(state.score, action)
            }
        },
        {
            tab: tabEmptyState(),
            score: scoreEmptyState()
        }
    );

    const actions = useMemo(() => {
        return {
            tab: tabActions(dispatch),
            score: scoreActions(dispatch)
        }
    }, [dispatch]);

    // log(state, 'state');

    return [state, actions];
}