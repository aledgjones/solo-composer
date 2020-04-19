import { useEffect, useMemo } from 'react';
import { instrumentDefs } from './instrument-defs';
import { PlayerType } from './player';
import { KeySignatureMode } from '../entries/key-signature';
import { NotationBaseDuration } from '../parse/notation-track';
import { getDefaultGroupings } from '../parse/get-default-groupings';
import { useAppActions, useAppState } from './state';
import { TabState } from './ui';

export function useAutoSetup() {

    const actions = useAppActions();
    const score = useAppState(s => s.score);

    const flowKey = useMemo(() => {
        return score.flows.order[0];
    }, [score.flows.order]);

    useEffect(() => {
        
        actions.ui.tab.set(TabState.setup);

        actions.score.flows.setLength(flowKey, (2 * 12 * 4) + (4 * 12 * 3));

        const ids = ['strings.violin', 'strings.violin', 'strings.viola', 'strings.violoncello'];

        ids.forEach(id => {
            const def = instrumentDefs[id];
            const instrument = actions.score.instruments.create(def);
            const playerKey = actions.score.players.create(PlayerType.solo);
            actions.score.players.assignInstrument(playerKey, instrument.key);
    
            const channel = actions.playback.sampler.createChannel();
            actions.playback.sampler.load(channel, def);
            actions.playback.sampler.assignInstrument(instrument.key, channel);
        });

        

        actions.score.flows.createTimeSignature({ beats: 4, beatType: 4, subdivisions: 12, groupings: getDefaultGroupings(4) }, 0, flowKey);
        actions.score.flows.createTimeSignature({ beats: 3, beatType: 4, subdivisions: 12, groupings: getDefaultGroupings(3) }, 2 * 12 * 4, flowKey);
        actions.score.flows.createKeySignature({ mode: KeySignatureMode.minor, offset: -3 }, 0, flowKey);
        actions.score.flows.createAbsoluteTempo({ text: 'Allegro', beat: NotationBaseDuration.crotchet, dotted: 0, beatPerMinute: 120, textVisible: true, beatPerMinuteVisible: true, parenthesis: true }, 0, flowKey);

    }, [actions.score.instruments, actions.score.players, actions.score.flows, actions.playback.sampler, actions.ui.tab, flowKey]);

}