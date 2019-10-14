import { useReducer, useMemo, useEffect } from "react"
import { TabState, tabReducer, tabEmptyState, tabActions, TabActions } from "./tab";
import { scoreActions, scoreReducer, scoreEmptyState, Score, ScoreActions } from "./score";
import { PlayerType } from "./player";
import { instrumentDefs } from "./instrument-defs";
import { log } from "../ui/utils/log";

export interface State {
    tab: TabState;
    score: Score;
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
        let instrument = actions.score.instruments.create(instrumentDefs['woodwinds.flute']);
        let player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

        // instrument = actions.score.instruments.create(instrumentDefs['strings.violin']);
        // player = actions.score.players.create(PlayerType.section);
        // actions.score.players.assignInstrument(player.key, instrument);

        // instrument = actions.score.instruments.create(instrumentDefs['strings.violin']);
        // player = actions.score.players.create(PlayerType.section);
        // actions.score.players.assignInstrument(player.key, instrument);
        
        // instrument = actions.score.instruments.create(instrumentDefs['strings.viola']);
        // player = actions.score.players.create(PlayerType.section);
        // actions.score.players.assignInstrument(player.key, instrument);

        // instrument = actions.score.instruments.create(instrumentDefs['strings.violoncello']);
        // player = actions.score.players.create(PlayerType.section);
        // actions.score.players.assignInstrument(player.key, instrument);
    }, [])

    log(state, 'state');

    return [state, actions];
}