import { useReducer, useMemo, useCallback, useEffect } from "react"
import { TabState, tabReducer, tabEmptyState, tabActions, TabActions } from "./tab";
import { scoreActions, scoreReducer, scoreEmptyState, Score, ScoreActions } from "./score";
import { log } from "../ui/utils/log";
import { instrumentDefs } from "./instrument-defs";
import { PlayerType } from "./player";

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
    const [state, dispatch] = useReducer(
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

    const actions = useMemo((): Actions => {
        return {
            tab: tabActions(dispatch),
            score: scoreActions(dispatch)
        }
    }, [dispatch]);

    useEffect(() => {

        let instrument = actions.score.instruments.create(instrumentDefs['strings.violin']);
        let player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

        instrument = actions.score.instruments.create(instrumentDefs['strings.violin']);
        player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

        instrument = actions.score.instruments.create(instrumentDefs['strings.viola']);
        player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

        instrument = actions.score.instruments.create(instrumentDefs['strings.violoncello']);
        player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

        instrument = actions.score.instruments.create(instrumentDefs['keyboards.piano']);
        player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

    }, [actions.score.instruments, actions.score.players]);

    if (LOGGING) {
        log(state, 'state');
    }

    return [state, actions];
}