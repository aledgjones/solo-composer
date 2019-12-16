import shortid from 'shortid';
import ArrayMove from 'array-move';
import { PlayerKey, PLAYER_CREATE, PLAYER_REMOVE, PLAYER_ASSIGN_INSTRUMENT, Players, Player } from './player';
import { Stave, StaveKey, Staves, createStave } from './stave';
import { removeProps } from '../ui/utils/remove-props';
import { instrumentDefs } from './instrument-defs';
import { Instruments } from './instrument';
import { Track, createTrack } from './track';
import { createTimeSignature } from '../entries/time-signature';
import { getDefaultGroupings } from '../parse/get-default-groupings';
import { createKeySignature, KeySignatureMode } from '../entries/key-signature';
import { Entry } from '../entries';

export const FLOW_CREATE = '@flow/create';
export const FLOW_REORDER = '@flow/reorder';
export const FLOW_REMOVE = '@flow/remove';
export const FLOW_ASSIGN_PLAYER = '@flow/assign-player';
export const FLOW_REMOVE_PLAYER = '@flow/remove-player';

export interface FlowActions {
    create: (playerKeys: PlayerKey[], players: Players, instruments: Instruments) => FlowKey;
    reorder: (instruction: { oldIndex: number, newIndex: number }) => void;
    remove: (flow: Flow) => void;
    assignPlayer: (flowKey: FlowKey, player: Player, instruments: Instruments) => void;
    removePlayer: (flowKey: FlowKey, playerKey: PlayerKey, staveKeys: StaveKey[]) => void;
}

export type FlowKey = string;

export type Flows = { [flowKey: string]: Flow };

export interface Flow {
    key: FlowKey;
    title: string;
    players: PlayerKey[] // unordered, purely for inclusion lookup
    staves: Staves;
    length: number; // number of subdevisions in all the flow
    master: Track;
}

export interface FlowState {
    order: FlowKey[];
    byKey: Flows;
}

export const flowEmptyState = (): FlowState => {
    const flow = createFlow([], {});
    return { order: [flow.key], byKey: { [flow.key]: flow } };
}

export const flowReducer = (state: FlowState, action: any) => {
    switch (action.type) {
        case FLOW_CREATE: {
            const key = action.payload.key;
            const flow = action.payload;
            return {
                order: [...state.order, key],
                byKey: {
                    ...state.byKey,
                    [key]: flow
                }
            };
        }
        case FLOW_REORDER: {
            const oldIndex = action.payload.oldIndex;
            const newIndex = action.payload.newIndex;
            return {
                ...state,
                order: ArrayMove(state.order, oldIndex, newIndex)
            }
        }
        case FLOW_REMOVE: {
            const key: FlowKey = action.payload.key;
            const { [key]: removed, ...flows } = state.byKey;
            return {
                order: state.order.filter(_key => _key !== key),
                byKey: flows
            }
        }
        case FLOW_ASSIGN_PLAYER: {
            const flowKey: FlowKey = action.payload.flowKey;
            const playerKey: PlayerKey = action.payload.playerKey;
            const staves: Staves = action.payload.staves;
            const flow = state.byKey[flowKey];
            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...flow,
                        staves: { ...flow.staves, ...staves },
                        players: [...flow.players, playerKey]
                    }
                }
            }
        }
        case FLOW_REMOVE_PLAYER: {
            const flowKey: FlowKey = action.payload.flowKey;
            const playerKey: PlayerKey = action.payload.playerKey;
            const staveKeys: StaveKey[] = action.payload.staveKeys;
            const flow = state.byKey[flowKey];
            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...flow,
                        staves: removeProps(flow.staves, staveKeys),
                        players: flow.players.filter(key => key !== playerKey)
                    }
                }
            }
        }
        case PLAYER_CREATE: {
            const playerKey: PlayerKey = action.payload.key;
            return {
                order: state.order,
                byKey: state.order.reduce((output: { [key: string]: Flow }, flowKey: string) => {
                    const flow = state.byKey[flowKey];
                    output[flowKey] = {
                        ...flow,
                        players: [...flow.players, playerKey]
                    }
                    return output;
                }, {})
            }
        }
        case PLAYER_REMOVE: {
            const playerKey: PlayerKey = action.payload.player.key;
            const staveKeys: StaveKey[] = action.payload.staveKeys;
            return {
                order: state.order,
                byKey: state.order.reduce((output: { [key: string]: Flow }, flowKey: string) => {
                    const flow = state.byKey[flowKey];
                    output[flowKey] = {
                        ...flow,
                        staves: removeProps(flow.staves, staveKeys),
                        players: flow.players.filter(key => key !== playerKey)
                    }
                    return output;
                }, {})
            }
        }
        case PLAYER_ASSIGN_INSTRUMENT: {
            const playerKey: PlayerKey = action.payload.playerKey;
            const staves: { [staveKey: string]: Stave } = action.payload.staves;
            return {
                order: state.order,
                byKey: state.order.reduce((output: { [key: string]: Flow }, flowKey: string) => {
                    const flow = state.byKey[flowKey];
                    if (flow.players.includes(playerKey)) {
                        output[flowKey] = {
                            ...flow,
                            staves: {
                                ...flow.staves,
                                ...staves
                            }
                        }
                    } else {
                        output[flowKey] = flow;
                    }
                    return output;
                }, {})
            }
        }
        default:
            return state;
    }
}

export const flowActions = (dispatch: any): FlowActions => {
    return {
        create: (playerKeys, players, instruments) => {
            const staves = playerKeys.reduce((output: { [staveKey: string]: Stave }, playerKey) => {
                const player = players[playerKey];
                player.instruments.forEach(instrumentKey => {
                    const instrument = instruments[instrumentKey];
                    const defs = instrumentDefs[instrument.id].staves;
                    instrument.staves.forEach((staveKey, i) => {
                        output[staveKey] = createStave(defs[i], staveKey);
                    });
                });
                return output;
            }, {});
            const flow = createFlow(playerKeys, staves);
            dispatch({ type: FLOW_CREATE, payload: flow });
            return flow.key;
        },
        reorder: (instruction) => {
            dispatch({ type: FLOW_REORDER, payload: instruction });
        },
        remove: (flow) => {
            dispatch({ type: FLOW_REMOVE, payload: flow });
        },
        assignPlayer: (flowKey, player, instruments) => {
            const staves = player.instruments.reduce((output: { [staveKey: string]: Stave }, instrumentKey) => {
                const instrument = instruments[instrumentKey];
                const defs = instrumentDefs[instrument.id].staves;
                instrument.staves.forEach((staveKey, i) => {
                    output[staveKey] = createStave(defs[i], staveKey);
                });
                return output;
            }, {});
            dispatch({ type: FLOW_ASSIGN_PLAYER, payload: { flowKey, playerKey: player.key, staves } });
        },
        removePlayer: (flowKey, playerKey, staveKeys) => {
            dispatch({ type: FLOW_REMOVE_PLAYER, payload: { flowKey, playerKey, staveKeys } });
        }
    }
}

const createFlow = (players: PlayerKey[], staves: { [key: string]: Stave }): Flow => {

    const events = [
        createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0),
        createKeySignature({ offset: -2, mode: KeySignatureMode.major }, 0)
    ];

    return {
        key: shortid(),
        title: 'Untitled Flow',
        players,
        staves,
        length: 6 * 6 * 4,
        master: createTrack(events)
    }
}