import { PlayerState, playerEmptyState, playerReducer, playerActions, PlayerActions } from "./player";
import { InstrumentActions, InstrumentState, instrumentEmptyState, instrumentReducer, instrumentActions } from "./instrument";
import { FlowActions, FlowState, flowEmptyState, flowReducer, flowActions } from "./flow";

export interface ScoreActions {
    players: PlayerActions;
    instruments: InstrumentActions;
    flows: FlowActions;
}

export interface ScoreState {
    players: PlayerState;
    instruments: InstrumentState;
    flows: FlowState;
}

export const scoreEmptyState = (): ScoreState => {
    return {
        players: playerEmptyState(),
        instruments: instrumentEmptyState(),
        flows: flowEmptyState()
    };
}

export const scoreReducer = (state: ScoreState, action: any) => {
    return {
        players: playerReducer(state.players, action),
        instruments: instrumentReducer(state.instruments, action),
        flows: flowReducer(state.flows, action)
    }
}

export const scoreActions = (dispatch: any) => {
    return {
        players: playerActions(dispatch),
        instruments: instrumentActions(dispatch),
        flows: flowActions(dispatch)
    }
}