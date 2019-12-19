import { useReducer, useMemo, useEffect } from "react"
import { TabState, tabReducer, tabEmptyState, tabActions, TabActions } from "./tab";
import { scoreActions, scoreReducer, scoreEmptyState, Score, ScoreActions } from "./score";
import { log } from "../ui/utils/log";
import { instrumentDefs } from "./instrument-defs";
import { PlayerType } from "./player";
import { getDefaultGroupings } from "../parse/get-default-groupings";
import { KeySignatureMode } from "../entries/key-signature";
import { BarlineType } from "../entries/barline";

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

    const flowKey = useMemo(() => {
        return state.score.flows.order[0];
    }, [state.score.flows.order]);

    useEffect(() => {

        const instrument = actions.score.instruments.create(instrumentDefs['keyboards.piano']);
        const player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

        actions.score.flows.createTimeSignature({ beats: 2, beatType: 4, subdivisions: 12, groupings: getDefaultGroupings(2) }, 0, flowKey);
        actions.score.flows.createTimeSignature({ beats: 4, beatType: 4, subdivisions: 12, groupings: getDefaultGroupings(4), drawAs: 'c' }, 48, flowKey);

        actions.score.flows.createKeySignature({ mode: KeySignatureMode.major, offset: -5 }, 0, flowKey);
        actions.score.flows.createKeySignature({ mode: KeySignatureMode.major, offset: 3 }, 48, flowKey);

        actions.score.flows.createBarline({ type: BarlineType.start_repeat }, 0, flowKey);
        actions.score.flows.createBarline({ type: BarlineType.end_repeat }, 24, flowKey);

    }, [actions.score.instruments, actions.score.players, actions.score.flows, flowKey]);

    log(state, 'state');

    return [state, actions];
}