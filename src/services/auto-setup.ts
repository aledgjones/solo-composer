import { useEffect, useMemo } from 'react';
import { instrumentDefs } from './instrument-defs';
import { PlayerType } from './player';
import { KeySignatureMode } from '../entries/key-signature';
import { NotationBaseDuration } from '../parse/notation-track';
import { getDefaultGroupings } from '../parse/get-default-groupings';
import { useAppActions, useAppState } from './state';
import { Score } from './score';

export function useAutoSetup() {

    const actions = useAppActions();
    const score = useAppState<Score>(s => s.score);

    const flowKey = useMemo(() => {
        return score.flows.order[0];
    }, [score.flows.order]);

    useEffect(() => {
        
        actions.score.flows.setLength(flowKey, 4 * 12 * 4);

        const def = instrumentDefs['strings.violin'];
        const instrumentKey = actions.score.instruments.create(def);
        const playerKey = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(playerKey, instrumentKey);

        const channel = actions.playback.sampler.createChannel();
        actions.playback.sampler.load(channel, def);
        actions.playback.sampler.assignInstrument(instrumentKey, channel);

        actions.score.flows.createTimeSignature({ beats: 4, beatType: 4, subdivisions: 12, groupings: getDefaultGroupings(4) }, 0, flowKey);
        actions.score.flows.createKeySignature({ mode: KeySignatureMode.minor, offset: 2 }, 0, flowKey);
        actions.score.flows.createAbsoluteTempo({ text: 'Allegro', beat: NotationBaseDuration.crotchet, dotted: 0, beatPerMinute: 120, textVisible: true, beatPerMinuteVisible: true, parenthesis: true }, 0, flowKey);

    }, [actions.score.instruments, actions.score.players, actions.score.flows, actions.playback.sampler, flowKey]);
}