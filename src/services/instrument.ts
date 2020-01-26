import { useMemo } from 'react';
import shortid from 'shortid';
import { toRoman } from 'roman-numerals';

import { InstrumentDef } from './instrument-defs';
import { PlayerKey, PlayerState } from './player';
import { StaveKey } from './stave';
import { Flow, FlowKey } from './flow';
import { ConfigState } from './config';
import { TrackKey } from './track';
import { ToneDef, createTone } from '../entries/tone';
import { useAppState, State } from './state';
import { Store } from 'pullstate';

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
            store.update(s => s.score.instruments[instrument.key] = instrument);
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

export enum InstrumentAutoCountStyle {
    arabic = 1,
    roman
}
type InstrumentCountsTotals = { [name: string]: InstrumentKey[] };
export type InstrumentCounts = { [instrumentKey: string]: string };

/**
 * Counts duplicate instrument names
 *  
 * If there is more than one of the same instrument we add an auto inc count.
 * we use the length of the count array to tell if > 1 if so index + 1 = instrument number.
 * 
 * eg violin ${counts['violin'].length + 1} = Violin *1*
 */
export function getCounts(players: PlayerState, instruments: Instruments, config: ConfigState) {

    const counts = players.order.reduce((output: InstrumentCountsTotals, playerKey: PlayerKey) => {
        const player = players.byKey[playerKey];
        player.instruments.forEach((instrumentKey: InstrumentKey) => {
            const instrument = instruments[instrumentKey];
            // consider solo / ensemble players as different by appending type
            const name = instrument.longName + ':' + player.type;
            if (!output[name]) {
                output[name] = [];
            }
            output[name].push(instrument.key);
        });
        return output;
    }, {});

    const names = Object.keys(counts);
    return names.reduce((out: InstrumentCounts, name: string) => {
        counts[name].forEach((instrumentKey, i, _names) => {
            if (_names.length > 1) {
                if (config.autoCountStyle === InstrumentAutoCountStyle.arabic) {
                    out[instrumentKey] = ` ${i + 1}`;
                } else {
                    out[instrumentKey] = ` ${toRoman(i + 1)}`;
                }
            }
        });
        return out;
    }, {});

}

export function useCounts(): InstrumentCounts {
    const { players, instruments, config } = useAppState<{ players: PlayerState, instruments: Instruments, config: ConfigState }>(s => ({
        players: s.score.players,
        instruments: s.score.instruments,
        config: s.score.config
    }));
    return useMemo(() => {
        return getCounts(players, instruments, config);
    }, [players, instruments, config]);
}

/**
 * get an array of instruments
 * optionally filter by the flow
 */
export function getInstruments(players: PlayerState, instruments: Instruments, flow?: Flow): Instrument[] {
    return players.order.reduce((output: Instrument[], playerKey) => {
        const player = players.byKey[playerKey];
        if (!flow || flow.players.includes(player.key)) {
            player.instruments.forEach(instrumentKey => {
                output.push(instruments[instrumentKey]);
            });
        }
        return output;
    }, []);
}

export function instrumentFamily(instrument?: Instrument) {
    return instrument ? instrument.id.split('.')[0] : '';
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