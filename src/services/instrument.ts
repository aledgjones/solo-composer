import shortid from 'shortid';
import { InstrumentDef } from './instrument-defs';
import { PlayerState, PlayerKey, PLAYER_REMOVE } from './player';
import { useMemo } from 'react';

export const INSTRUMENT_CREATE = '@instrument/create';
export const INSTRUMENT_REMOVE = '@instrument/remove';

export type InstrumentKey = string;

export interface InstrumentActions {
    create: (def: InstrumentDef) => InstrumentKey;
    remove: (instrumentKey: InstrumentKey) => void;
}

export interface Instrument {
    key: InstrumentKey;
    id: string;
    longName: string;
    shortName: string;
}

export interface InstrumentState {
    [key: string]: Instrument;
}

export const instrumentEmptyState = (): InstrumentState => {
    return {};
}

export const instrumentReducer = (state: InstrumentState, action: any) => {
    switch (action.type) {
        case INSTRUMENT_CREATE: {
            const key: InstrumentKey = action.payload.key;
            const instrument: Instrument = action.payload;
            return { ...state, [key]: instrument };
        }
        case INSTRUMENT_REMOVE: {
            const instrumentKey: InstrumentKey = action.payload;
            const { [instrumentKey]: removed, ...instruments } = state;
            return instruments;
        }
        case PLAYER_REMOVE: {
            const instrumentKeys: InstrumentKey[] = action.payload.instruments;
            const keys = Object.keys(state);
            return keys.reduce((output: InstrumentState, key: string) => {
                if (!instrumentKeys.includes(key)) {
                    output[key] = state[key];
                }
                return output;
            }, {});
        }
        default:
            return state;
    }
}

export const instrumentActions = (dispatch: any): InstrumentActions => {
    return {
        create: (def) => {
            const instrument = createInstrument(def);
            dispatch({ type: INSTRUMENT_CREATE, payload: instrument });
            return instrument.key;
        },
        remove: (instrumentKey) => {
            dispatch({ type: INSTRUMENT_REMOVE, payload: instrumentKey });
        }
    }
}

const createInstrument = (def: InstrumentDef): Instrument => {
    return {
        key: shortid(),
        id: def.id,
        longName: def.longName,
        shortName: def.shortName
    }
}

type InstrumentCountsTotals = { [name: string]: InstrumentKey[] };
export type InstrumentCounts = { [key: string]: number };

/**
 * Counts duplicate instrument names
 *  
 * If there is more than one of the same instrument we add an auto inc count.
 * we use the length of the count array to tell if > 1 if so index + 1 = instrument number.
 * 
 * eg violin ${counts['violin'].length + 1} = Violin *1*
 */
export function useCounts(players: PlayerState, instruments: InstrumentState): InstrumentCounts {
    return useMemo(() => {

        const counts = players.order.reduce((output: InstrumentCountsTotals, playerKey: PlayerKey) => {
            const player = players.byKey[playerKey];
            player.instruments.forEach((instrumentKey: InstrumentKey) => {
                const instrument = instruments[instrumentKey];
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
                    out[instrumentKey] = i + 1;
                }
            });
            return out;
        }, {});

    }, [players, instruments]);
}