import { useMemo } from 'react';
import shortid from 'shortid';
import { toRoman } from 'roman-numerals';

import { InstrumentDef } from './instrument-defs';
import { PlayerKey, PLAYER_REMOVE, PlayerState } from './player';
import { StaveKey, createStave } from './stave';
import { removeProps } from '../ui/utils/remove-props';
import { Flow } from './flow';
import { ConfigState } from './config';

export const INSTRUMENT_CREATE = '@instrument/create';
export const INSTRUMENT_REMOVE = '@instrument/remove';

export type InstrumentKey = string;

export interface InstrumentActions {
    create: (def: InstrumentDef) => Instrument;
    remove: (instrumentKey: InstrumentKey) => void;
}

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

export const instrumentReducer = (state: Instruments, action: any) => {
    switch (action.type) {
        case INSTRUMENT_CREATE: {
            const instrumentKey: InstrumentKey = action.payload.instrument.key;
            const instrument: Instrument = action.payload.instrument;
            return { ...state, [instrumentKey]: instrument };
        }
        case INSTRUMENT_REMOVE: {
            const instrumentKey: InstrumentKey = action.payload;
            const { [instrumentKey]: removed, ...instruments } = state;
            return instruments;
        }
        case PLAYER_REMOVE: {
            const instrumentKeys: InstrumentKey[] = action.payload.player.instruments;
            return removeProps(state, instrumentKeys);
        }
        default:
            return state;
    }
}

export const instrumentActions = (dispatch: any): InstrumentActions => {
    return {
        create: (def) => {
            const staves = def.staves.map(staveDef => createStave(staveDef));
            const instrument = createInstrument(def, staves.map(stave => stave.key));
            dispatch({ type: INSTRUMENT_CREATE, payload: { instrument, staves } });
            return instrument;
        },
        remove: (instrumentKey) => {
            dispatch({ type: INSTRUMENT_REMOVE, payload: instrumentKey });
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

export function useCounts(players: PlayerState, instruments: Instruments, config: ConfigState): InstrumentCounts {
    return useMemo(() => {
        return getCounts(players, instruments, config);
    }, [players, instruments, config]);
}

/**
 * get an array of instruments
 */
export function getInstruments(players: PlayerState, instruments: Instruments, flow: Flow): Instrument[] {
    return players.order.reduce((output: Instrument[], playerKey) => {
        const player = players.byKey[playerKey];
        if (flow.players.includes(player.key)) {
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