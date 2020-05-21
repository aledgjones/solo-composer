import shortid from "shortid";
import ArrayMove from "array-move";

import { PlayerKey } from "./player";
import { Staves, createStave } from "./stave";
import { instrumentDefs } from "./instrument-defs";
import { Track, createTrack, Tracks } from "./track";
import { TimeSignatureDef, createTimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { getTicksPerBeat } from "../parse/get-ticks-per-beat";
import { KeySignatureDef, createKeySignature } from "../entries/key-signature";
import { BarlineDef, createBarline } from "../entries/barline";
import { createAbsoluteTempo, AbsoluteTempoDef } from "../entries/absolute-tempo";
import { Store } from "pullstate";
import { State } from "./state";
import { assignEntryToTrack } from "./utils";

export type FlowKey = string;

export type Flows = { [flowKey: string]: Flow };

export interface Flow {
    key: FlowKey;
    title: string;
    players: PlayerKey[]; // unordered, purely for inclusion lookup
    staves: Staves;
    tracks: Tracks;
    subdivisions: number;
    length: number; // number of subdevisions in all the flow
    master: Track;
}

export interface FlowState {
    order: FlowKey[];
    byKey: Flows;
}

export const flowEmptyState = (): FlowState => {
    const flow = createFlow();
    return { order: [flow.key], byKey: { [flow.key]: flow } };
};

export const flowActions = (store: Store<State>) => {
    return {
        create: () => {
            // create an empty flow
            const flow = createFlow();

            store.update((s) => {
                //populate flow with all players/instruments
                s.score.players.order.forEach((playerKey) => {
                    const player = s.score.players.byKey[playerKey];
                    player.instruments.forEach((instrumentKey) => {
                        const instrument = s.score.instruments[instrumentKey];
                        const def = instrumentDefs[s.score.instruments[instrumentKey].id];
                        instrument.staves.forEach((staveKey, i) => {
                            const track = createTrack([]);
                            const stave = createStave(def.staves[i], staveKey, [track.key]);
                            flow.players.push(playerKey);
                            flow.staves[stave.key] = stave;
                            flow.tracks[track.key] = track;
                        });
                    });
                });

                // append the new flow
                s.score.flows.order.push(flow.key);
                s.score.flows.byKey[flow.key] = flow;
            });

            return flow.key;
        },
        rename: (flowKey: FlowKey, title: string) => {
            store.update((s) => {
                s.score.flows.byKey[flowKey].title = title;
            });
        },
        reorder: (oldIndex: number, newIndex: number) => {
            store.update((s) => {
                s.score.flows.order = ArrayMove(s.score.flows.order, oldIndex, newIndex);
            });
        },
        remove: (flowKey: FlowKey) => {
            store.update((s) => {
                s.score.flows.order = s.score.flows.order.filter((key) => key !== flowKey);
                delete s.score.flows.byKey[flowKey];
            });
        },
        assignPlayer: (flowKey: FlowKey, playerKey: PlayerKey) => {
            store.update((s) => {
                const flow = s.score.flows.byKey[flowKey];

                // actually assign the players
                flow.players.push(playerKey);

                const player = s.score.players.byKey[playerKey];
                player.instruments.forEach((instrumentKey) => {
                    const instrument = s.score.instruments[instrumentKey];
                    const def = instrumentDefs[s.score.instruments[instrumentKey].id];
                    instrument.staves.forEach((staveKey, i) => {
                        const track = createTrack([]);
                        const stave = createStave(def.staves[i], staveKey, [track.key]);
                        flow.players.push(playerKey);
                        flow.staves[stave.key] = stave;
                        flow.tracks[track.key] = track;
                    });
                });
            });
        },
        removePlayer: (flowKey: FlowKey, playerKey: PlayerKey) => {
            store.update((s) => {
                const flow = s.score.flows.byKey[flowKey];
                flow.players = flow.players.filter((key) => key !== playerKey);
                s.score.players.byKey[playerKey].instruments.forEach((instrumentKey) => {
                    s.score.instruments[instrumentKey].staves.forEach((staveKey) => {
                        flow.staves[staveKey].tracks.forEach((trackKey) => {
                            delete flow.tracks[trackKey];
                        });
                        delete flow.staves[staveKey];
                    });
                });
            });
        },
        setLength: (flowKey: FlowKey, length: number) => {
            store.update((s) => {
                s.score.flows.byKey[flowKey].length = length;
            });
        },
        // create new or updating an existing time sig at tick
        createTimeSignature: (timeSignatureDef: TimeSignatureDef, tick: number, flowKey: FlowKey) => {
            store.update((s) => {
                const entry = createTimeSignature(timeSignatureDef, tick);
                const flow = s.score.flows.byKey[flowKey];

                // extend the length to fit the whole bar if shorter
                const ticksPerBeat = getTicksPerBeat(flow.subdivisions, entry.beatType);
                const ticksPerBar = entry.beats * ticksPerBeat;
                if (flow.length - entry._tick < ticksPerBar) {
                    const length = entry._tick + ticksPerBar;
                    flow.length = length;
                }

                assignEntryToTrack(flow.master, entry, EntryType.timeSignature);
            });
        },
        createKeySignature: (keySignatureDef: KeySignatureDef, tick: number, flowKey: FlowKey) => {
            store.update((s) => {
                const entry = createKeySignature(keySignatureDef, tick);
                const track = s.score.flows.byKey[flowKey].master;
                assignEntryToTrack(track, entry, EntryType.keySignature);
            });
        },
        createBarline: (barlineDef: BarlineDef, tick: number, flowKey: FlowKey) => {
            store.update((s) => {
                const entry = createBarline(barlineDef, tick);
                const track = s.score.flows.byKey[flowKey].master;
                assignEntryToTrack(track, entry, EntryType.barline);
            });
        },
        createAbsoluteTempo: (absoluteTempoDef: AbsoluteTempoDef, tick: number, flowKey: FlowKey) => {
            store.update((s) => {
                const entry = createAbsoluteTempo(absoluteTempoDef, tick);
                const track = s.score.flows.byKey[flowKey].master;
                assignEntryToTrack(track, entry, EntryType.absoluteTempo);
            });
        }
    };
};

const createFlow = (): Flow => {
    return {
        key: shortid(),
        title: "Untitled Flow",
        players: [],
        staves: {},
        tracks: {},
        subdivisions: 12,
        length: 12,
        master: createTrack([])
    };
};
