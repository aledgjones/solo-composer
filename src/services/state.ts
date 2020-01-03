import { useReducer, useMemo, useEffect } from "react"
import { TabState, tabReducer, tabEmptyState, tabActions, TabActions } from "./tab";
import { scoreActions, scoreReducer, scoreEmptyState, Score, ScoreActions } from "./score";
import { instrumentDefs } from "./instrument-defs";
import { PlayerType } from "./player";
import { getDefaultGroupings } from "../parse/get-default-groupings";
import { KeySignatureMode } from "../entries/key-signature";
import { NotationBaseLength } from "../parse/notation-track";
import { PlaybackState, PlaybackActions, playbackReducer, playbackEmptyState, playbackActions } from "./playback";

import { log } from "../ui/utils/log";

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

    // TEMP SCORE SETUP FOR DEV

    const flowKey = useMemo(() => {
        return state.score.flows.order[0];
    }, [state.score.flows.order]);

    useEffect(() => {

        actions.score.flows.setLength(144, flowKey);

        const instrument = actions.score.instruments.create(instrumentDefs['strings.viola']);
        const player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

        actions.score.flows.createTimeSignature({ beats: 3, beatType: 4, subdivisions: 12, groupings: getDefaultGroupings(3) }, 0, flowKey);
        actions.score.flows.createKeySignature({ mode: KeySignatureMode.minor, offset: -3 }, 0, flowKey);
        actions.score.flows.createAbsoluteTempo({ text: 'Allegro', beat: NotationBaseLength.crotchet, dotted: false, beatPerMinute: 120, textVisible: true, beatPerMinuteVisible: true, parenthesis: true }, 0, flowKey);

    }, [actions.score.instruments, actions.score.players, actions.score.flows, flowKey]);

    log(state.playback, 'playback');

    return [state, actions];
}