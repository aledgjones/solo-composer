import { Sampler, SamplerCurrentState, Patches } from "../playback/sampler";
import { InstrumentKey } from "./instrument";
import { InstrumentDef } from "./instrument-defs";

const sampler = new Sampler();

export const SAMPLER_CREATE_CHANNEL = '@sampler/create-channel';
export const SAMPLER_SET_STATE = '@sampler/set-state';
export const SAMPLER_SET_PROGRESS = '@sampler/set-progress';
export const SAMPLER_ASSIGN_INSTRUMENT_TO_CHANNEL = '@sampler/assign-instrument-to-channel';

export interface SamplerActions {
    init: () => void;
    load: (channel: string, def: InstrumentDef) => Promise<void>;
    assignInstrument: (instrumentKey: string, channel: string) => void;
}

export type ChannelKey = string;

export interface Channel {
    key: string;
    state: SamplerCurrentState;
    progress: number;
    patchName: string;
    patches: string[];
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
            const patches = action.payload.patches;
            const patchName = action.payload.patchName;
            return {
                ...state,
                channels: {
                    order: [...state.channels.order, channel],
                    byKey: {
                        ...state.channels.byKey,
                        [channel]: {
                            key: channel,
                            state: SamplerCurrentState.loading,
                            progress: 0,
                            patchName,
                            patches
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
        load: (channel, def) => {
            return sampler.load(channel, def.patches, def.id);
        },
        assignInstrument: (instrumentKey, channel) => {
            // the sampler itself doesn't actually care about this so just dispatch directly
            dispatch({ type: SAMPLER_ASSIGN_INSTRUMENT_TO_CHANNEL, payload: { instrumentKey, channel } })
        }
    }
}