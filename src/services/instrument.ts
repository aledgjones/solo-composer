import { useMemo } from 'react';
import { Store } from 'pullstate';
import shortid from 'shortid';

import { InstrumentDef } from './instrument-defs';
import { StaveKey } from './stave';
import { FlowKey } from './flow';
import { TrackKey } from './track';
import { ToneDef, createTone } from '../entries/tone';
import { useAppState, State } from './state';
import { InstrumentCounts, getCounts } from './instrument-utils';

export type InstrumentKey = string;

export interface Instrument {
    key: InstrumentKey;
    id: string;
    longName: string;
    shortName: string;
    staves: StaveKey[];
}

export type Instruments = { [key: string]: Instrument; };

export const instrumentEmptyState = (): Instruments => {
    return {};
}

export const instrumentActions = (store: Store<State>) => {
    return {
        // this purely creates an instrumnet -- players are added to flows so flow update not needed here
        // instruments are assigned to players seperately
        create: (def: InstrumentDef) => {
            const staveKeys = def.staves.map(staveDef => shortid());
            const instrument = createInstrument(def, staveKeys);
            store.update(s => {
                s.score.instruments[instrument.key] = instrument;
            });
            return instrument.key;
        },
        remove: (instrumentKey: InstrumentKey) => {
            // remove from score.instruments
            // remove from each flow
        },
        createTone: (flowKey: FlowKey, trackKey: TrackKey, def: ToneDef, tick: number) => {
            const tone = createTone(def, tick);
            store.update(s => {
                const track = s.score.flows.byKey[flowKey].tracks[trackKey];
                track.entries.byKey[tone._key] = tone;
                track.entries.order.push(tone._key);
            });
        }
    }
}

export const createInstrument = (def: InstrumentDef, staves: StaveKey[]): Instrument => {
    return {
        key: shortid(),
        id: def.id,
        longName: def.longName,
        shortName: def.shortName,
        staves
    }
}

export function useCounts(): InstrumentCounts {
    const { players, instruments, config } = useAppState(s => ({
        players: s.score.players,
        instruments: s.score.instruments,
        config: s.score.config
    }));
    return useMemo(() => {
        return getCounts(players, instruments, config);
    }, [players, instruments, config]);
}

export function useInstrumentName(instrument?: Instrument, count?: string) {
    return useMemo(() => {
        if (instrument) {
            return instrument.longName + (count ? ` ${count}` : '');
        } else {
            return '';
        }
    }, [instrument, count]);
}