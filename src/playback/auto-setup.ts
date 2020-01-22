import { useEffect, useMemo } from 'react';
import { Actions, State } from '../services/state';
import { instrumentDefs } from '../services/instrument-defs';
import { PlayerType } from '../services/player';
import { KeySignatureMode } from '../entries/key-signature';
import { NotationBaseLength } from '../parse/notation-track';
import { getDefaultGroupings } from '../parse/get-default-groupings';

export function useAutoSetup(state: State, actions: Actions) {

    const flowKey = useMemo(() => {
        return state.score.flows.order[0];
    }, [state.score.flows.order]);

    useEffect(() => {
        actions.score.flows.setLength(4 * 12 * 4, flowKey);

        const def = instrumentDefs['strings.violoncello'];
        const instrument = actions.score.instruments.create(def);
        const player = actions.score.players.create(PlayerType.solo);
        actions.score.players.assignInstrument(player.key, instrument);

        const channel = actions.playback.sampler.createChannel();
        actions.playback.sampler.load(channel, def);
        actions.playback.sampler.assignInstrument(instrument.key, channel);

        actions.score.flows.createTimeSignature({ beats: 4, beatType: 4, subdivisions: 12, groupings: getDefaultGroupings(4) }, 0, flowKey);
        actions.score.flows.createKeySignature({ mode: KeySignatureMode.major, offset: 4 }, 0, flowKey);
        actions.score.flows.createAbsoluteTempo({ text: 'Allegro', beat: NotationBaseLength.crotchet, dotted: 0, beatPerMinute: 120, textVisible: true, beatPerMinuteVisible: true, parenthesis: true }, 0, flowKey);

    }, [actions.score.instruments, actions.score.players, actions.score.flows, actions.playback.sampler, flowKey]);
}