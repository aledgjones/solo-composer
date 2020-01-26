import { Store } from "pullstate";
import shortid from "shortid";

import { State } from "./state";
import { InstrumentKey } from "./instrument";
import { ChannelKey, PatchKey } from "../playback/output";
import { Sampler, SamplerCurrentState, Patches } from "../playback/sampler";
import { InstrumentDef } from "./instrument-defs";

const sampler = new Sampler();

export interface Channel {
    key: ChannelKey;
    state: SamplerCurrentState;
    progress: number;
    patchGroupName?: string;
    patches: {
        order: PatchKey[];
        byKey: Patches;
    };
    assigned?: InstrumentKey;
}


export interface ChannelState {
    order: ChannelKey[];
    byKey: {
        [channel: string]: Channel;
    }
}

export interface SamplerState {
    channels: ChannelState;
}

export const samplerEmptyState = (): SamplerState => {
    return {
        channels: {
            order: [],
            byKey: {}
        }
    };
}

export const samplerActions = (store: Store<State>) => {
    return {
        createChannel: () => {
            const channelKey = shortid();
            store.update(s => {
                s.playback.sampler.channels.order.push(channelKey);
                s.playback.sampler.channels.byKey[channelKey] = {
                    key: channelKey,
                    state: SamplerCurrentState.ready,
                    progress: 1,
                    patches: {
                        order: [],
                        byKey: {}
                    }
                }
            });
            return channelKey;
        },
        load: async (channelKey: ChannelKey, def: InstrumentDef) => {
            store.update(s => {
                const channel = s.playback.sampler.channels.byKey[channelKey];
                channel.state = SamplerCurrentState.loading;
                channel.patchGroupName = def.id;
                channel.patches.order = Object.keys(def.patches);
                channel.patches.byKey = def.patches;
            });
            await sampler.load(channelKey, def.patches, def.id, (progress) => {
                store.update(s => {
                    const channel = s.playback.sampler.channels.byKey[channelKey];
                    channel.progress = progress;
                });
            });
            store.update(s => {
                const channel = s.playback.sampler.channels.byKey[channelKey];
                channel.state = SamplerCurrentState.ready;
            });
        },
        assignInstrument: (instrumentKey: InstrumentKey, channel: ChannelKey) => {
            store.update(s => s.playback.sampler.channels.byKey[channel].assigned = instrumentKey);
        },
        stopAll: () => {
            sampler.stopAll();
        },
        test: (channel: ChannelKey, patch: PatchKey) => {
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