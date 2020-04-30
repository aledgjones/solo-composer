import { Store } from "pullstate";
import { State } from "./state";
import { PlayerState, playerEmptyState, playerActions } from "./player";
import { Instruments, instrumentEmptyState, instrumentActions } from "./instrument";
import { FlowState, flowEmptyState, flowActions } from "./flow";
import { configEmptyState, configActions, ConfigState } from "./config";
import { EngravingState, engravingEmptyState, engravingActions } from "./engraving";

export interface Score {
    meta: {
        title: string;
        composer: string;
        created: number;
    }
    config: ConfigState;
    engraving: EngravingState;
    players: PlayerState;
    instruments: Instruments;
    flows: FlowState;
}

export const scoreEmptyState = (): Score => {
    return {
        meta: {
            title: 'Untitled Score',
            composer: 'Anonymous',
            created: Date.now()
        },
        config: configEmptyState(),
        engraving: engravingEmptyState(),
        players: playerEmptyState(),
        instruments: instrumentEmptyState(),
        flows: flowEmptyState()
    };
}

export const scoreActions = (store: Store<State>) => {
    return {
        config: configActions(store),
        engraving: engravingActions(store),
        players: playerActions(store),
        instruments: instrumentActions(store),
        flows: flowActions(store)
    }
}