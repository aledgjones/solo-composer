import { PlayerState, playerEmptyState, playerReducer, playerActions, PlayerActions } from "./player";
import { InstrumentActions, Instruments, instrumentEmptyState, instrumentReducer, instrumentActions } from "./instrument";
import { FlowActions, FlowState, flowEmptyState, flowReducer, flowActions } from "./flow";
import { ConfigActions, configEmptyState, configReducer, configActions, ConfigState } from "./config";
import { EngravingActions, EngravingState, engravingEmptyState, engravingReducer, engravingActions } from "./engraving";

export interface ScoreActions {
    config: ConfigActions;
    engraving: EngravingActions
    players: PlayerActions;
    instruments: InstrumentActions;
    flows: FlowActions;
}

export interface Score {
    config: ConfigState;
    engraving: EngravingState;
    players: PlayerState;
    instruments: Instruments;
    flows: FlowState;
}

export const scoreEmptyState = (): Score => {
    return {
        config: configEmptyState(),
        engraving: engravingEmptyState(),
        players: playerEmptyState(),
        instruments: instrumentEmptyState(),
        flows: flowEmptyState()
    };
}

export const scoreReducer = (state: Score, action: any) => {
    return {
        config: configReducer(state.config, action),
        engraving: engravingReducer(state.engraving, action),
        players: playerReducer(state.players, action),
        instruments: instrumentReducer(state.instruments, action),
        flows: flowReducer(state.flows, action)
    }
}

export const scoreActions = (dispatch: any) => {
    return {
        config: configActions(dispatch),
        engraving: engravingActions(dispatch),
        players: playerActions(dispatch),
        instruments: instrumentActions(dispatch),
        flows: flowActions(dispatch)
    }
}