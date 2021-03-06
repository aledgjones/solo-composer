import { useMemo } from "react";
import { mdiAccount, mdiAccountGroup } from "@mdi/js";
import shortid from "shortid";
import ArrayMove from "array-move";
import { InstrumentKey, Instruments } from "./score-instrument";
import { createStave } from "./stave";
import { instrumentDefs } from "./score-instrument-defs";
import { Store } from "pullstate";
import { State } from "./state";
import { createTrack } from "./track";
import { InstrumentCounts } from "./score-instrument-utils";

export type PlayerKey = string;

export enum PlayerType {
    solo = 1,
    section
}

export interface Player {
    key: PlayerKey;
    type: PlayerType;
    instruments: InstrumentKey[];
}

export type Players = { [key: string]: Player };

export interface PlayerState {
    order: PlayerKey[];
    byKey: Players;
}

export const playerEmptyState = (): PlayerState => {
    return {
        order: [],
        byKey: {}
    };
};

export const playerActions = (store: Store<State>) => {
    return {
        create: (type: PlayerType) => {
            const player = createPlayer(type);
            store.update((s) => {
                // add the player
                s.score.players.order.push(player.key);
                s.score.players.byKey[player.key] = player;

                // auto include it in all flows
                s.score.flows.order.forEach((flowKey) => {
                    s.score.flows.byKey[flowKey].players.push(player.key);
                });
            });
            return player.key;
        },
        reorder: (oldIndex: number, newIndex: number) => {
            store.update((s) => {
                s.score.players.order = ArrayMove(s.score.players.order, oldIndex, newIndex);
            });
        },
        remove: (playerKey: PlayerKey) => {
            store.update((s) => {
                // remove the player's staves and tracks from each flow
                // we iterate the player's instruments and cross reference within the flows.
                s.score.players.byKey[playerKey].instruments.forEach((instrumentKey) => {
                    const staves = s.score.instruments[instrumentKey].staves;
                    s.score.flows.order.forEach((flowKey) => {
                        const flow = s.score.flows.byKey[flowKey];
                        staves.forEach((staveKey) => {
                            const stave = flow.staves[staveKey];
                            if (stave) {
                                // delete each track from the flow
                                stave.tracks.forEach((trackKey) => {
                                    delete flow.tracks[trackKey];
                                });
                                // delete the stave from the flow
                                delete flow.staves[staveKey];
                            }
                        });
                        // delete the instruments
                        delete s.score.instruments[instrumentKey];
                    });
                });

                // remove the player as from the flow
                s.score.flows.order.forEach((flowKey) => {
                    const flow = s.score.flows.byKey[flowKey];
                    flow.players = flow.players.filter((key) => key !== playerKey);
                });

                // delete the player itself
                s.score.players.order = s.score.players.order.filter((key) => key !== playerKey);
                delete s.score.players.byKey[playerKey];
            });
        },
        assignInstrument: (playerKey: PlayerKey, instrumentKey: InstrumentKey) => {
            store.update((s) => {
                // add the instrument to the player
                s.score.players.byKey[playerKey].instruments.push(instrumentKey);

                // add the instrument staves to each flow which contains that player
                const def = instrumentDefs[s.score.instruments[instrumentKey].id];
                s.score.flows.order.forEach((flowKey) => {
                    const flow = s.score.flows.byKey[flowKey];
                    if (flow.players.includes(playerKey)) {
                        s.score.instruments[instrumentKey].staves.forEach((staveKey, i) => {
                            const track = createTrack([]);
                            flow.staves[staveKey] = createStave(def.staves[i], staveKey, [track.key]);
                            flow.tracks[track.key] = track;
                        });
                    }
                });
            });
        }
    };
};

const createPlayer = (type: PlayerType): Player => {
    return {
        key: shortid(),
        type,
        instruments: []
    };
};

export function usePlayerName(player: Player, instruments: Instruments, counts: InstrumentCounts) {
    return useMemo(() => {
        if (player.instruments.length === 0) {
            switch (player.type) {
                case PlayerType.solo:
                    return "Empty-handed Player";
                default:
                    return "Empty-handed Section";
            }
        } else {
            const len = player.instruments.length;
            return player.instruments.reduce((output, key, i) => {
                const isFirst = i === 0;
                const isLast = i === len - 1;
                const count = counts[key];
                const name = instruments[key].longName + (count ? ` ${count}` : "");
                if (isFirst) {
                    return name;
                } else if (isLast) {
                    return output + " & " + name;
                } else {
                    return output + ", " + name;
                }
            }, "");
        }
    }, [player.type, player.instruments, instruments, counts]);
}

export function usePlayerIcon(player: Player) {
    return useMemo(() => {
        switch (player.type) {
            case PlayerType.solo:
                return mdiAccount;
            default:
                return mdiAccountGroup;
        }
    }, [player]);
}
