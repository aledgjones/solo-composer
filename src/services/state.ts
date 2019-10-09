import { useReducer, useMemo, useEffect } from "react"
import { TabState, tabReducer, tabEmptyState, tabActions, TabActions } from "./tab";
import { scoreActions, scoreReducer, scoreEmptyState, ScoreState, ScoreActions } from "./score";
import { PlayerType } from "./player";
import { instrumentDefs } from "./instrument-defs";
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

    useEffect(() => {
        // setup
        let playerKey = actions.score.players.create(PlayerType.solo);
        let instrumentKey = actions.score.instruments.create(instrumentDefs['strings.violin']);
        actions.score.players.assignInstrument(playerKey, instrumentKey);

        playerKey = actions.score.players.create(PlayerType.section);
        instrumentKey = actions.score.instruments.create(instrumentDefs['strings.violin']);
        actions.score.players.assignInstrument(playerKey, instrumentKey);

        playerKey = actions.score.players.create(PlayerType.section);
        instrumentKey = actions.score.instruments.create(instrumentDefs['strings.violin']);
        actions.score.players.assignInstrument(playerKey, instrumentKey);

        playerKey = actions.score.players.create(PlayerType.section);
        instrumentKey = actions.score.instruments.create(instrumentDefs['strings.viola']);
        actions.score.players.assignInstrument(playerKey, instrumentKey);

        playerKey = actions.score.players.create(PlayerType.section);
        instrumentKey = actions.score.instruments.create(instrumentDefs['strings.violoncello']);
        actions.score.players.assignInstrument(playerKey, instrumentKey);
    }, []);

    // log(state, 'state');

    return [state, actions];
}