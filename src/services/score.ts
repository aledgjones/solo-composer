import { Store } from "pullstate";
import { State } from "./state";
import { PlayerState, playerEmptyState, playerActions } from "./score-player";
import { Instruments, instrumentEmptyState, instrumentActions } from "./score-instrument";
import { FlowState, flowEmptyState, flowActions } from "./score-flow";
import { configEmptyState, configActions, ConfigState } from "./score-config";
import { EngravingState, engravingEmptyState, engravingActions } from "./score-engraving";

interface ScoreMeta {
    title: string;
    composer: string;
    created: number;
}

export interface Score {
    meta: ScoreMeta;
    config: ConfigState;
    engraving: EngravingState;
    players: PlayerState;
    instruments: Instruments;
    flows: FlowState;
}

export const scoreEmptyState = (): Score => {
    return {
        meta: {
            title: "Untitled Score",
            composer: "Anonymous",
            created: Date.now()
        },
        config: configEmptyState(),
        engraving: engravingEmptyState(),
        players: playerEmptyState(),
        instruments: instrumentEmptyState(),
        flows: flowEmptyState()
    };
};

export const scoreActions = (store: Store<State>) => {
    return {
        meta: {
            update: (meta: Partial<ScoreMeta>) => {
                store.update((s) => {
                    s.score.meta = {
                        ...s.score.meta,
                        ...meta
                    };
                });
            }
        },
        config: configActions(store),
        engraving: engravingActions(store),
        players: playerActions(store),
        instruments: instrumentActions(store),
        flows: flowActions(store)
    };
};
