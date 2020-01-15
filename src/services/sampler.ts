import { Sampler, SamplerCurrentState, Patches } from "../playback/sampler";
import { InstrumentKey } from "./instrument";
import { InstrumentDef } from "./instrument-defs";
import shortid from "shortid";
import { ChannelKey } from "../playback/output";

const sampler = new Sampler();

export const SAMPLER_CREATE_CHANNEL = '@sampler/create-channel';
export const SAMPLER_LOAD_PATCHES = '@sampler/load-patches';
export const SAMPLER_SET_STATE = '@sampler/set-state';
export const SAMPLER_SET_PROGRESS = '@sampler/set-progress';
export const SAMPLER_ASSIGN_INSTRUMENT_TO_CHANNEL = '@sampler/assign-instrument-to-channel';

export interface SamplerActions {
    init: () => void;
    createChannel: () => string;
    load: (channel: ChannelKey, def: InstrumentDef) => Promise<void>;
    assignInstrument: (instrumentKey: string, channel: string) => void;
    stopAll: () => void;
    test: (channel: ChannelKey, patch: string) => void;
}

export interface Channel {
    key: string;
    state: SamplerCurrentState;
    progress: number;
    patchName?: string;
    patches: {
        order: string[];
        byKey: Patches;
    };
    assigned?: InstrumentKey;
}

export interface SamplerState {
    channels: {
        order: ChannelKey[];
        byKey: {
            [channel: string]: Channel;
        }
    }
}

export const samplerEmptyState = (): SamplerState => {
    return {
        channels: {
            order: [],
            byKey: {}
        }
    };
}

export const samplerReducer = (state: SamplerState, action: any) => {
    switch (action.type) {
        case SAMPLER_CREATE_CHANNEL: {
            const channel = action.payload.channel;
            return {
                ...state,
                channels: {
                    order: [...state.channels.order, channel],
                    byKey: {
                        ...state.channels.byKey,
                        [channel]: {
                            key: channel,
                            state: SamplerCurrentState.ready,
                            progress: 1,
                            patches: []
                        }
                    }
                }
            }
        }
        case SAMPLER_LOAD_PATCHES: {
            const channel = action.payload.channel;
            const patchesOrder = action.payload.patchesByKey;
            const patchesByKey = action.payload.patchesOrder;
            const patchName = action.payload.patchName;
            return {
                ...state,
                channels: {
                    order: state.channels.order,
                    byKey: {
                        ...state.channels.byKey,
                        [channel]: {
                            ...state.channels.byKey[channel],
                            state: SamplerCurrentState.loading,
                            progress: 0,
                            patchName,
                            patches: {
                                order: patchesOrder,
                                byKey: patchesByKey
                            }
                        }
                    }
                }
            }
        }
        case SAMPLER_SET_STATE: {
            const channel = action.payload.channel;
            const currentState: SamplerCurrentState = action.payload.state;
            return {
                ...state,
                channels: {
                    order: state.channels.order,
                    byKey: {
                        ...state.channels.byKey,
                        [channel]: {
                            ...state.channels.byKey[channel],
                            state: currentState
                        }
                    }
                }
            }
        }
        case SAMPLER_SET_PROGRESS: {
            const channel = action.payload.channel;
            const progress = action.payload.progress;
            return {
                ...state,
                channels: {
                    order: state.channels.order,
                    byKey: {
                        ...state.channels.byKey,
                        [channel]: {
                            ...state.channels.byKey[channel],
                            progress
                        }
                    }
                }
            }
        }
        case SAMPLER_ASSIGN_INSTRUMENT_TO_CHANNEL: {
            const channel = action.payload.channel;
            const assigned = action.payload.instrumentKey;
            return {
                ...state,
                channels: {
                    order: state.channels.order,
                    byKey: {
                        ...state.channels.byKey,
                        [channel]: {
                            ...state.channels.byKey[channel],
                            assigned
                        }
                    }
                }
            }
        }
        default:
            return state;
    }
}

export const samplerActions = (dispatch: any): SamplerActions => {
    return {
        init: () => {
            sampler.listen(dispatch);
        },
        createChannel: () => {
            const channel = shortid();
            dispatch({ type: SAMPLER_CREATE_CHANNEL, payload: { channel } });
            return channel;
        },
        load: (channel, def) => {
            return sampler.load(channel, def.patches, def.id);
        },
        assignInstrument: (instrumentKey, channel) => {
            // the sampler itself doesn't actually care about this so just dispatch directly
            dispatch({ type: SAMPLER_ASSIGN_INSTRUMENT_TO_CHANNEL, payload: { instrumentKey, channel } })
        },
        stopAll: () => {
            sampler.stopAll();
        },
        test: (channel, patch) => {
            sampler.play(channel, patch, 'C4', 100, 250, 0);
            sampler.play(channel, patch, 'D4', 105, 250, 250);
            sampler.play(channel, patch, 'E4', 110, 250, 500);
            sampler.play(channel, patch, 'F4', 115, 250, 750);
            sampler.play(channel, patch, 'G4', 120, 250, 1000);
            sampler.play(channel, patch, 'F4', 115, 250, 1250);
            sampler.play(channel, patch, 'E4', 110, 250, 1500);
            sampler.play(channel, patch, 'D4', 105, 250, 1750);
            sampler.play(channel, patch, 'C4', 100, 1000, 2000);
        }
    }
}