import { PlayerState, playerEmptyState, playerReducer, playerActions, PlayerActions } from "./player";
import { InstrumentActions, Instruments, instrumentEmptyState, instrumentReducer, instrumentActions } from "./instrument";
import { FlowActions, FlowState, flowEmptyState, flowReducer, flowActions } from "./flow";
import { ConfigActions, Config, configEmptyState, configReducer, configActions } from "./config";

export interface ScoreActions {
    config: ConfigActions;
    players: PlayerActions;
    instruments: InstrumentActions;
    flows: FlowActions;
}

export interface Score {
    config: Config;
    players: PlayerState;
    instruments: Instruments;
    flows: FlowState;
}

export const scoreEmptyState = (): Score => {
    return {
        config: configEmptyState(),
        players: playerEmptyState(),
        instruments: instrumentEmptyState(),
        flows: flowEmptyState()
    };
}

export const scoreReducer = (state: Score, action: any) => {
    return {
        config: configReducer(state.config, action),
        players: playerReducer(state.players, action),
        instruments: instrumentReducer(state.instruments, action),
        flows: flowReducer(state.flows, action)
    }
}

export const scoreActions = (dispatch: any) => {
    return {
        config: configActions(dispatch),
        players: playerActions(dispatch),
        instruments: instrumentActions(dispatch),
        flows: flowActions(dispatch)
    }
}