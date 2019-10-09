import shortid from 'shortid';
import ArrayMove from 'array-move';
import { PlayerKey } from './player';

export const FLOW_CREATE = '@flow/create';
export const FLOW_REORDER = '@flow/reorder';
export const FLOW_REMOVE = '@flow/remove';

export type FlowKey = string;

export interface FlowActions {
    create: (players: PlayerKey[]) => FlowKey;
    reorder: (instruction: { oldIndex: number, newIndex: number }) => void;
    remove: (flow: Flow) => void;
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