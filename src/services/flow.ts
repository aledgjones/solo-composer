import shortid from 'shortid';
import ArrayMove from 'array-move';
import { PlayerKey, PLAYER_CREATE, PLAYER_REMOVE } from './player';

export const FLOW_CREATE = '@flow/create';
export const FLOW_REORDER = '@flow/reorder';
export const FLOW_REMOVE = '@flow/remove';
export const FLOW_ASSIGN_PLAYER = '@flow/assign-player';
export const FLOW_REMOVE_PLAYER = '@flow/remove-player';

export type FlowKey = string;

export interface FlowActions {
    create: (players: PlayerKey[]) => FlowKey;
    reorder: (instruction: { oldIndex: number, newIndex: number }) => void;
    remove: (flow: Flow) => void;
    assignPlayer: (flowKey: FlowKey, playerKey: PlayerKey) => void;
    removePlayer: (flowKey: FlowKey, playerKey: PlayerKey) => void;
}

export interface Flow {
    key: FlowKey;
    title: string;
    players: PlayerKey[] // unordered, purely for inclusion lookup
}

export interface FlowState {
    order: FlowKey[];
    byKey: { [key: string]: Flow };
}

export const flowEmptyState = (): FlowState => {
    // score initialises with an empty flow
    const flow = createFlow([]);
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
            const playerKey: FlowKey = action.payload.playerKey;
            const flow = state.byKey[flowKey];
            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...flow,
                        players: [...flow.players, playerKey]
                    }
                }
            }
        }
        case FLOW_REMOVE_PLAYER: {
            const flowKey: FlowKey = action.payload.flowKey;
            const playerKey: FlowKey = action.payload.playerKey;
            const flow = state.byKey[flowKey];
            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...flow,
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
            const playerKey: PlayerKey = action.payload.key;
            return {
                order: state.order,
                byKey: state.order.reduce((output: { [key: string]: Flow }, flowKey: string) => {
                    const flow = state.byKey[flowKey];
                    output[flowKey] = {
                        ...flow,
                        players: flow.players.filter(key => key !== playerKey)
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
        create: (players) => {
            const flow = createFlow(players);
            dispatch({ type: FLOW_CREATE, payload: flow });
            return flow.key;
        },
        reorder: (instruction) => {
            dispatch({ type: FLOW_REORDER, payload: instruction });
        },
        remove: (flow) => {
            dispatch({ type: FLOW_REMOVE, payload: flow });
        },
        assignPlayer: (flowKey, playerKey) => {
            dispatch({ type: FLOW_ASSIGN_PLAYER, payload: { flowKey, playerKey } });
        },
        removePlayer: (flowKey, playerKey) => {
            dispatch({ type: FLOW_ASSIGN_PLAYER, payload: { flowKey, playerKey } });
        }
    }
}

const createFlow = (players: PlayerKey[]): Flow => {
    return {
        key: shortid(),
        title: 'Untitled Flow',
        players
    }
}