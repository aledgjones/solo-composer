import shortid from 'shortid';
import ArrayMove from 'array-move';
import { InstrumentKey } from './instrument';

export const PLAYER_CREATE = '@player/create';
export const PLAYER_REMOVE = '@player/remove';
export const PLAYER_REORDER = '@player/reorder';
export const PLAYER_ASSIGN_INSTRUMENT = '@player/assign-instrument';

export type PlayerKey = string;

export interface PlayerActions {
    create: (type: PlayerType) => string;
    reorder: (instruction: { oldIndex: number, newIndex: number }) => void;
    remove: (player: Player) => void;
    assignInstrument: (playerKey: PlayerKey, instrument: InstrumentKey) => void;
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

export interface PlayerState {
    order: PlayerKey[];
    byKey: { [key: string]: Player };
}

export const playerEmptyState = (): PlayerState => {
    return { order: [], byKey: {} };
}

export const playerReducer = (state: PlayerState, action: any) => {
    switch (action.type) {
        case PLAYER_CREATE: {
            const playerKey: PlayerKey = action.payload.key;
            const player: Player = action.payload;
            return {
                order: [...state.order, playerKey],
                byKey: { ...state.byKey, [playerKey]: player }
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
            const playerKey: PlayerKey = action.payload.key;
            const { [playerKey]: removed, ...players } = state.byKey;
            return {
                order: state.order.filter(key => playerKey !== key),
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
            return player.key;
        },
        reorder: (instruction) => {
            dispatch({ type: PLAYER_REORDER, payload: instruction });
        },
        remove: (player) => {
            dispatch({ type: PLAYER_REMOVE, payload: player });
        },
        assignInstrument: (playerKey, instrumentKey) => {
            dispatch({ type: PLAYER_ASSIGN_INSTRUMENT, payload: { playerKey, instrumentKey } });
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