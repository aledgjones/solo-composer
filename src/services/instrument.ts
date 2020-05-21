import { useMemo } from "react";
import { Store } from "pullstate";
import shortid from "shortid";
import arrayMove from "array-move";

import { InstrumentDef } from "./instrument-defs";
import { StaveKey } from "./stave";
import { FlowKey } from "./flow";
import { TrackKey } from "./track";
import { Tone, ToneDef, createTone } from "../entries/tone";
import { useAppState, State } from "./state";
import { InstrumentCounts, getCounts } from "./instrument-utils";
import { Entry } from "../entries";
import { PlayerKey } from "./player";

export type InstrumentKey = string;

export interface Instrument {
    key: InstrumentKey;
    id: string;
    longName: string;
    shortName: string;
    staves: StaveKey[];
}

export type Instruments = { [key: string]: Instrument };

export const instrumentEmptyState = (): Instruments => {
    return {};
};

export const instrumentActions = (store: Store<State>) => {
    return {
        // this purely creates an instrumnet -- players are added to flows so flow update not needed here
        // instruments are assigned to players seperately
        create: (def: InstrumentDef) => {
            const staveKeys = def.staves.map((staveDef) => shortid());
            const instrument = createInstrument(def, staveKeys);
            store.update((s) => {
                s.score.instruments[instrument.key] = instrument;
            });
            return instrument;
        },
        reorder: (playerKey: PlayerKey, oldIndex: number, newIndex: number) => {
            store.update((s) => {
                s.score.players.byKey[playerKey].instruments = arrayMove(
                    s.score.players.byKey[playerKey].instruments,
                    oldIndex,
                    newIndex
                );
            });
        },
        remove: (instrumentKey: InstrumentKey) => {
            store.update((s) => {
                // remove the instrument from the player
                s.score.players.order.forEach((playerKey) => {
                    const player = s.score.players.byKey[playerKey];
                    player.instruments = player.instruments.filter((key) => key !== instrumentKey);
                });

                // for each flow, we remove the instrument's staves and each of their tracks
                s.score.flows.order.forEach((flowKey) => {
                    const flow = s.score.flows.byKey[flowKey];
                    s.score.instruments[instrumentKey].staves.forEach((staveKey) => {
                        const stave = flow.staves[staveKey];
                        // its possible this flow doesn't include the player so check the stave
                        // is actually present
                        if (stave) {
                            // delete each track
                            stave.tracks.forEach((trackKey) => {
                                delete flow.tracks[trackKey];
                            });
                            // delete the stave
                            delete flow.staves[staveKey];
                        }
                    });
                });

                delete s.score.instruments[instrumentKey];
            });
        },
        createTone: (flowKey: FlowKey, trackKey: TrackKey, def: ToneDef, tick: number) => {
            const tone = createTone(def, tick);
            store.update((s) => {
                const track = s.score.flows.byKey[flowKey].tracks[trackKey];
                track.entries.byKey[tone._key] = tone;
                track.entries.order.push(tone._key);
            });
            return tone;
        },
        updateTone: (flowKey: FlowKey, trackKey: TrackKey, toneKey: string, def: Partial<ToneDef>, tick?: number) => {
            store.update((s) => {
                const track = s.score.flows.byKey[flowKey].tracks[trackKey];
                const tone = track.entries.byKey[toneKey] as Entry<Tone>;
                track.entries.byKey[toneKey] = {
                    ...tone,
                    _tick: tick !== undefined ? tick : tone._tick,
                    ...def
                };
            });
        },
        removeTone: (flowKey: FlowKey, trackKey: TrackKey, toneKey: string) => {
            store.update((s) => {
                const track = s.score.flows.byKey[flowKey].tracks[trackKey];
                delete track.entries.byKey[toneKey];
                track.entries.order = track.entries.order.filter((entry: string) => entry !== toneKey);
            });
        }
    };
};

export const createInstrument = (def: InstrumentDef, staves: StaveKey[]): Instrument => {
    return {
        key: shortid(),
        id: def.id,
        longName: def.longName,
        shortName: def.shortName,
        staves
    };
};

export function useCounts(): InstrumentCounts {
    const { players, instruments, config } = useAppState((s) => ({
        players: s.score.players,
        instruments: s.score.instruments,
        config: s.score.config
    }));
    return useMemo(() => {
        return getCounts(players, instruments, config);
    }, [players, instruments, config]);
}

export function useInstrumentName(instrument?: Instrument, count?: string) {
    return useMemo(() => {
        if (instrument) {
            return instrument.longName + (count ? ` ${count}` : "");
        } else {
            return "";
        }
    }, [instrument, count]);
}
