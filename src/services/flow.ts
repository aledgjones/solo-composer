import shortid from 'shortid';
import ArrayMove from 'array-move';
import { PlayerKey, PLAYER_CREATE, PLAYER_REMOVE, PLAYER_ASSIGN_INSTRUMENT, Players, Player } from './player';
import { Stave, StaveKey, Staves, createStave } from './stave';
import { removeProps } from '../ui/utils/remove-props';
import { instrumentDefs } from './instrument-defs';
import { Instruments, INSTRUMENT_CREATE_TONE } from './instrument';
import { Track, createTrack, entriesByTick, TrackKey } from './track';
import { TimeSignatureDef, TimeSignature, createTimeSignature } from '../entries/time-signature';
import { Entry, EntryType } from '../entries';
import { getTicksPerBeat } from '../parse/get-ticks-per-beat';
import { getEntryAtTick } from '../parse/get-entry-at-tick';
import { KeySignatureDef, createKeySignature, KeySignature } from '../entries/key-signature';
import { BarlineDef, createBarline, Barline } from '../entries/barline';
import { createAbsoluteTempo, AbsoluteTempoDef, AbsoluteTempo } from '../entries/absolute-tempo';
import { Tone } from '../entries/tone';

export const FLOW_CREATE = '@flow/create';
export const FLOW_REORDER = '@flow/reorder';
export const FLOW_REMOVE = '@flow/remove';
export const FLOW_ASSIGN_PLAYER = '@flow/assign-player';
export const FLOW_REMOVE_PLAYER = '@flow/remove-player';
export const FLOW_CREATE_TIME_SIGNATURE = '@flow/create-time-signature';
export const FLOW_CREATE_KEY_SIGNATURE = '@flow/create-key-signature';
export const FLOW_CREATE_BARLINE = '@flow/create-barline';
export const FLOW_CREATE_ABSOLUTE_TEMPO = '@flow/create-absolute-tempo';
export const FLOW_SET_LENGTH = '@flow/set-length';

export interface FlowActions {
    create: (playerKeys: PlayerKey[], players: Players, instruments: Instruments) => FlowKey;
    reorder: (instruction: { oldIndex: number, newIndex: number }) => void;
    remove: (flow: Flow) => void;
    assignPlayer: (flowKey: FlowKey, player: Player, instruments: Instruments) => void;
    removePlayer: (flowKey: FlowKey, playerKey: PlayerKey, staveKeys: StaveKey[]) => void;
    createTimeSignature: (def: TimeSignatureDef, tick: number, flowKey: string) => void;
    createKeySignature: (def: KeySignatureDef, tick: number, flowKey: string) => void;
    createBarline: (def: BarlineDef, tick: number, flowKey: string) => void;
    createAbsoluteTempo: (def: AbsoluteTempoDef, tick: number, flowKey: string) => void;
    setLength: (length: number, flowKey: string) => void;
}

export type FlowKey = string;

export type Flows = { [flowKey: string]: Flow };

export interface Flow {
    key: FlowKey;
    title: string;
    players: PlayerKey[] // unordered, purely for inclusion lookup
    staves: Staves;
    length: number; // number of subdevisions in all the flow
    master: Track;
}

export interface FlowState {
    order: FlowKey[];
    byKey: Flows;
}

export const flowEmptyState = (): FlowState => {
    const flow = createFlow([], {});
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
        case FLOW_ASSIGN_PLAYER: {
            const flowKey: FlowKey = action.payload.flowKey;
            const playerKey: PlayerKey = action.payload.playerKey;
            const staves: Staves = action.payload.staves;
            const flow = state.byKey[flowKey];
            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...flow,
                        staves: { ...flow.staves, ...staves },
                        players: [...flow.players, playerKey]
                    }
                }
            }
        }
        case FLOW_REMOVE_PLAYER: {
            const flowKey: FlowKey = action.payload.flowKey;
            const playerKey: PlayerKey = action.payload.playerKey;
            const staveKeys: StaveKey[] = action.payload.staveKeys;
            const flow = state.byKey[flowKey];
            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...flow,
                        staves: removeProps(flow.staves, staveKeys),
                        players: flow.players.filter(key => key !== playerKey)
                    }
                }
            }
        }
        case PLAYER_CREATE: {
            const playerKey: PlayerKey = action.payload.key;
            return {
                order: state.order,
                byKey: state.order.reduce((output: { [key: string]: Flow }, flowKey: string) => {
                    const flow = state.byKey[flowKey];
                    output[flowKey] = {
                        ...flow,
                        players: [...flow.players, playerKey]
                    }
                    return output;
                }, {})
            }
        }
        case PLAYER_REMOVE: {
            const playerKey: PlayerKey = action.payload.player.key;
            const staveKeys: StaveKey[] = action.payload.staveKeys;
            return {
                order: state.order,
                byKey: state.order.reduce((output: { [key: string]: Flow }, flowKey: string) => {
                    const flow = state.byKey[flowKey];
                    output[flowKey] = {
                        ...flow,
                        staves: removeProps(flow.staves, staveKeys),
                        players: flow.players.filter(key => key !== playerKey)
                    }
                    return output;
                }, {})
            }
        }
        case PLAYER_ASSIGN_INSTRUMENT: {
            const playerKey: PlayerKey = action.payload.playerKey;
            const staves: { [staveKey: string]: Stave } = action.payload.staves;
            return {
                order: state.order,
                byKey: state.order.reduce((output: { [key: string]: Flow }, flowKey: string) => {
                    const flow = state.byKey[flowKey];
                    if (flow.players.includes(playerKey)) {
                        output[flowKey] = {
                            ...flow,
                            staves: {
                                ...flow.staves,
                                ...staves
                            }
                        }
                    }
                    return output;
                }, state.byKey)
            }
        }
        case FLOW_SET_LENGTH: {
            const flowKey = action.payload.flowKey;
            const length: number = action.payload.length;
            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...state.byKey[flowKey],
                        length
                    }
                }
            }
        }
        // this also includes updating an exisitng time sig to avoid having more than one
        case FLOW_CREATE_TIME_SIGNATURE: {
            const flowKey = action.payload.flowKey;
            const entry: Entry<TimeSignature> = action.payload.entry;
            const flow = state.byKey[flowKey];

            // extend the length to fit the whole bar if shorter
            const ticksPerBeat = getTicksPerBeat(entry.subdivisions, entry.beatType);
            const ticksPerBar = entry.beats * ticksPerBeat;
            let length = flow.length;
            if (flow.length - entry._tick < ticksPerBar) {
                length = entry._tick + ticksPerBar;
            }

            // if there is already a time sig at tick, replace with new entry
            const entries = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);
            const old = getEntryAtTick<TimeSignature>(entry._tick, entries, EntryType.timeSignature);
            if (old.entry) {
                entry._key = old.entry._key;
            }

            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...state.byKey[flowKey],
                        length,
                        master: {
                            ...state.byKey[flowKey].master,
                            entries: {
                                order: !old.entry ? [...state.byKey[flowKey].master.entries.order, entry._key] : state.byKey[flowKey].master.entries.order,
                                byKey: {
                                    ...state.byKey[flowKey].master.entries.byKey,
                                    [entry._key]: entry
                                }
                            }
                        }
                    }
                }
            }
        }
        case FLOW_CREATE_KEY_SIGNATURE: {
            const flowKey = action.payload.flowKey;
            const entry: Entry<KeySignature> = action.payload.entry;
            const flow = state.byKey[flowKey];

            // if there is already a key sig at tick, replace with new entry
            const entries = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);
            const old = getEntryAtTick<KeySignature>(entry._tick, entries, EntryType.keySignature);
            if (old.entry) {
                entry._key = old.entry._key;
            }

            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...state.byKey[flowKey],
                        master: {
                            ...state.byKey[flowKey].master,
                            entries: {
                                order: !old.entry ? [...state.byKey[flowKey].master.entries.order, entry._key] : state.byKey[flowKey].master.entries.order,
                                byKey: {
                                    ...state.byKey[flowKey].master.entries.byKey,
                                    [entry._key]: entry
                                }
                            }
                        }
                    }
                }
            }
        }
        case FLOW_CREATE_BARLINE: {
            const flowKey = action.payload.flowKey;
            const entry: Entry<Barline> = action.payload.entry;
            const flow = state.byKey[flowKey];

            // if there is already a barline at tick, replace with new entry
            const entries = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);
            const old = getEntryAtTick<Barline>(entry._tick, entries, EntryType.barline);
            if (old.entry) {
                entry._key = old.entry._key;
            }

            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...state.byKey[flowKey],
                        master: {
                            ...state.byKey[flowKey].master,
                            entries: {
                                order: !old.entry ? [...state.byKey[flowKey].master.entries.order, entry._key] : state.byKey[flowKey].master.entries.order,
                                byKey: {
                                    ...state.byKey[flowKey].master.entries.byKey,
                                    [entry._key]: entry
                                }
                            }
                        }
                    }
                }
            }
        }
        case FLOW_CREATE_ABSOLUTE_TEMPO: {
            const flowKey = action.payload.flowKey;
            const entry: Entry<AbsoluteTempo> = action.payload.entry;
            const flow = state.byKey[flowKey];

            // if there is already a absolute tempo at tick, replace with new entry
            const entries = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);
            const old = getEntryAtTick<AbsoluteTempo>(entry._tick, entries, EntryType.absoluteTempo);
            if (old.entry) {
                entry._key = old.entry._key;
            }

            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...state.byKey[flowKey],
                        master: {
                            ...state.byKey[flowKey].master,
                            entries: {
                                order: !old.entry ? [...state.byKey[flowKey].master.entries.order, entry._key] : state.byKey[flowKey].master.entries.order,
                                byKey: {
                                    ...state.byKey[flowKey].master.entries.byKey,
                                    [entry._key]: entry
                                }
                            }
                        }
                    }
                }
            }
        }
        case INSTRUMENT_CREATE_TONE: {
            // SO FAR THIS IS DUMB - WE NEED TO MAKE IT SMARTER AT SHIFTING BEATS etc.
            const flowKey: FlowKey = action.payload.flowKey;
            const staveKey: StaveKey = action.payload.staveKey;
            const trackKey: TrackKey = action.payload.trackKey;
            const tone: Entry<Tone> = action.payload.tone;
            return {
                order: state.order,
                byKey: {
                    ...state.byKey,
                    [flowKey]: {
                        ...state.byKey[flowKey],
                        staves: {
                            ...state.byKey[flowKey].staves,
                            [staveKey]: {
                                ...state.byKey[flowKey].staves[staveKey],
                                tracks: {
                                    ...state.byKey[flowKey].staves[staveKey].tracks,
                                    byKey: {
                                        ...state.byKey[flowKey].staves[staveKey].tracks.byKey,
                                        [trackKey]: {
                                            ...state.byKey[flowKey].staves[staveKey].tracks.byKey[trackKey],
                                            entries: {
                                                order: [...state.byKey[flowKey].staves[staveKey].tracks.byKey[trackKey].entries.order, tone._key],
                                                byKey: {
                                                    ...state.byKey[flowKey].staves[staveKey].tracks.byKey[trackKey].entries.byKey,
                                                    [tone._key]: tone
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
        default:
            return state;
    }
}

export const flowActions = (dispatch: any): FlowActions => {
    return {
        create: (playerKeys, players, instruments) => {
            const staves = playerKeys.reduce((output: { [staveKey: string]: Stave }, playerKey) => {
                const player = players[playerKey];
                player.instruments.forEach(instrumentKey => {
                    const instrument = instruments[instrumentKey];
                    const defs = instrumentDefs[instrument.id].staves;
                    instrument.staves.forEach((staveKey, i) => {
                        output[staveKey] = createStave(defs[i], staveKey);
                    });
                });
                return output;
            }, {});
            const flow = createFlow(playerKeys, staves);
            dispatch({ type: FLOW_CREATE, payload: flow });
            return flow.key;
        },
        reorder: (instruction) => {
            dispatch({ type: FLOW_REORDER, payload: instruction });
        },
        remove: (flow) => {
            dispatch({ type: FLOW_REMOVE, payload: flow });
        },
        assignPlayer: (flowKey, player, instruments) => {
            const staves = player.instruments.reduce((output: { [staveKey: string]: Stave }, instrumentKey) => {
                const instrument = instruments[instrumentKey];
                const defs = instrumentDefs[instrument.id].staves;
                instrument.staves.forEach((staveKey, i) => {
                    output[staveKey] = createStave(defs[i], staveKey);
                });
                return output;
            }, {});
            dispatch({ type: FLOW_ASSIGN_PLAYER, payload: { flowKey, playerKey: player.key, staves } });
        },
        removePlayer: (flowKey, playerKey, staveKeys) => {
            dispatch({ type: FLOW_REMOVE_PLAYER, payload: { flowKey, playerKey, staveKeys } });
        },
        createTimeSignature: (timeSignatureDef, tick, flowKey) => {
            dispatch({
                type: FLOW_CREATE_TIME_SIGNATURE,
                payload: {
                    flowKey,
                    entry: createTimeSignature(timeSignatureDef, tick)
                }
            });
        },
        createKeySignature: (keySignatureDef, tick, flowKey) => {
            dispatch({
                type: FLOW_CREATE_KEY_SIGNATURE,
                payload: {
                    flowKey,
                    entry: createKeySignature(keySignatureDef, tick)
                }
            });
        },
        createBarline: (barlineDef, tick, flowKey) => {
            dispatch({
                type: FLOW_CREATE_BARLINE,
                payload: {
                    flowKey,
                    entry: createBarline(barlineDef, tick)
                }
            });
        },
        createAbsoluteTempo: (absoluteTempoDef, tick, flowKey) => {
            dispatch({
                type: FLOW_CREATE_BARLINE,
                payload: {
                    flowKey,
                    entry: createAbsoluteTempo(absoluteTempoDef, tick)
                }
            });
        },
        setLength: (length, flowKey) => {
            dispatch({
                type: FLOW_SET_LENGTH,
                payload: {
                    flowKey,
                    length
                }
            })
        }
    }
}

const createFlow = (players: PlayerKey[], staves: { [key: string]: Stave }): Flow => {
    return {
        key: shortid(),
        title: 'Untitled Flow',
        players,
        staves,
        length: 12,
        master: createTrack([])
    }
}