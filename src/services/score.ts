import { PlayerState, playerEmptyState, playerReducer, playerActions, PlayerActions } from "./player";
import { InstrumentActions, InstrumentState, instrumentEmptyState, instrumentReducer, instrumentActions } from "./instrument";

export interface ScoreActions {
    players: PlayerActions;
    instruments: InstrumentActions;
}

export interface ScoreState {
    players: PlayerState;
    instruments: InstrumentState;
}

export const scoreEmptyState = (): ScoreState => {
    return {
        players: playerEmptyState(),
        instruments: instrumentEmptyState()
    };
}

export const scoreReducer = (state: ScoreState, action: any) => {
    return {
        players: playerReducer(state.players, action),
        instruments: instrumentReducer(state.instruments, action)
    }
}

export const scoreActions = (dispatch: any) => {
    return {
        players: playerActions(dispatch),
        instruments: instrumentActions(dispatch)
    }
}