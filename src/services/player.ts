import shortid from 'shortid';
import ArrayMove from 'array-move';
import { InstrumentKey, Instrument, Instruments, InstrumentCounts } from './instrument';
import { Staves, createStave, StaveKey } from './stave';
import { instrumentDefs } from './instrument-defs';
import { useMemo } from 'react';
import { mdiAccount, mdiAccountGroup } from '@mdi/js';

export const PLAYER_CREATE = '@player/create';
export const PLAYER_REMOVE = '@player/remove';
export const PLAYER_REORDER = '@player/reorder';
export const PLAYER_ASSIGN_INSTRUMENT = '@player/assign-instrument';

export type PlayerKey = string;

export interface PlayerActions {
    create: (type: PlayerType) => Player;
    reorder: (instruction: { oldIndex: number, newIndex: number }) => void;
    remove: (player: Player, instruments: Instruments) => void;
    assignInstrument: (playerKey: PlayerKey, instrument: Instrument) => void;
}

export enum PlayerType {
    solo = 1,
    section
}

export interface Player {
    key: PlayerKey;
    type: PlayerType;
    instruments: InstrumentKey[];
}

export type Players = { [key: string]: Player };

export interface PlayerState {
    order: PlayerKey[];
    byKey: Players;
}

export const playerEmptyState = (): PlayerState => {
    return { order: [], byKey: {} };
}

export const playerReducer = (state: PlayerState, action: any) => {
    switch (action.type) {
        case PLAYER_CREATE: {
            const key: PlayerKey = action.payload.key;
            const player: Player = action.payload;
            return {
                order: [...state.order, key],
                byKey: { ...state.byKey, [key]: player }
            };
        }
        case PLAYER_REORDER: {
            const oldIndex = action.payload.oldIndex;
            const newIndex = action.payload.newIndex;
            return {
                ...state,
                order: ArrayMove(state.order, oldIndex, newIndex)
            }
        }
        case PLAYER_REMOVE: {
            const key: PlayerKey = action.payload.player.key;
            const { [key]: removed, ...players } = state.byKey;
            return {
                order: state.order.filter(_key => _key !== key),
                byKey: players
            }
        }
        case PLAYER_ASSIGN_INSTRUMENT: {
            const playerKey: PlayerKey = action.payload.playerKey;
            const instrumentKey: InstrumentKey = action.payload.instrumentKey;
            const player: Player = state.byKey[playerKey];
            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [playerKey]: {
                        ...player,
                        instruments: [...player.instruments, instrumentKey]
                    }
                }
            }
        }
        default:
            return state;
    }
}

export const playerActions = (dispatch: any): PlayerActions => {
    return {
        create: (type) => {
            const player = createPlayer(type);
            dispatch({ type: PLAYER_CREATE, payload: player });
            return player;
        },
        reorder: (instruction) => {
            dispatch({ type: PLAYER_REORDER, payload: instruction });
        },
        remove: (player, instruments) => {
            const staveKeys = player.instruments.reduce((output: StaveKey[], instrumentKey) => {
                const instrument = instruments[instrumentKey];
                return [...output, ...instrument.staves];
            }, []);
            dispatch({ type: PLAYER_REMOVE, payload: { player, staveKeys } });
        },
        assignInstrument: (playerKey, instrument) => {
            const instrumentKey = instrument.key;
            const def = instrumentDefs[instrument.id];
            const staves = instrument.staves.reduce((output: Staves, staveKey, i) => {
                output[staveKey] = createStave(def.staves[i], staveKey);
                return output;
            }, {});
            dispatch({ type: PLAYER_ASSIGN_INSTRUMENT, payload: { playerKey, instrumentKey, staves } });
        }
    }
}

const createPlayer = (type: PlayerType): Player => {
    return {
        key: shortid(),
        type,
        instruments: []
    }
}

export function usePlayerName(player: Player, instruments: Instruments, counts: InstrumentCounts) {
    return useMemo(() => {
        if (player.instruments.length === 0) {
            switch (player.type) {
                case PlayerType.solo:
                    return 'Empty-handed Player';
                default:
                    return 'Empty-handed Section'
            }
        } else {
            const len = player.instruments.length;
            return player.instruments.reduce((output, key, i) => {
                const isFirst = i === 0;
                const isLast = i === len - 1;
                const count = counts[key];
                const name = instruments[key].longName + (count ? ` ${count}` : '');
                if (isFirst) {
                    return name;
                } else if (isLast) {
                    return output + ' & ' + name;
                } else {
                    return output + ', ' + name;
                }
            }, '');
        }
    }, [player.type, player.instruments, instruments, counts]);
}

export function usePlayerIcon(player: Player) {
    return useMemo(() => {
        switch (player.type) {
            case PlayerType.solo:
                return mdiAccount;
            default:
                return mdiAccountGroup;
        }
    }, [player]);
}