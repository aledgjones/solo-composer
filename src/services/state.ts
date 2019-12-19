import { useReducer, useMemo, useEffect } from "react"
import { TabState, tabReducer, tabEmptyState, tabActions, TabActions } from "./tab";
import { scoreActions, scoreReducer, scoreEmptyState, Score, ScoreActions } from "./score";
import { log } from "../ui/utils/log";
import { instrumentDefs } from "./instrument-defs";
import { PlayerType } from "./player";
import { getDefaultGroupings } from "../parse/get-default-groupings";

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

    const flow = useMemo(() => {
        const flowKey = state.score.flows.order[0];
        return state.score.flows.byKey[flowKey];
    }, []);

    useEffect(() => {

        const instrument = actions.score.instruments.create(instrumentDefs['keyboards.piano']);
        const player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

        actions.score.flows.createTimeSignature({ beats: 4, beatType: 4, subdivisions: 12, groupings: getDefaultGroupings(4) }, 0, flow);
        actions.score.flows.createTimeSignature({ beats: 6, beatType: 8, subdivisions: 12, groupings: getDefaultGroupings(6) }, 48, flow);

    }, [actions.score.instruments, actions.score.players, actions.score.flows, flow]);

    if (LOGGING) {
        log(state, 'state');
    }

    return [state, actions];
}