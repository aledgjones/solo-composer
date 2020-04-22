import { Store } from "pullstate";
import shortid from "shortid";

import { State } from "./state";
import { InstrumentKey } from "./instrument";
import { SoloSampler, SamplerCurrentState } from "../playback/sampler";
import { InstrumentDef, PatchDef } from "./instrument-defs";
import { ChannelKey } from "../playback/sampler-channel";
import { Expressions } from "../playback/expressions";

const sampler = new SoloSampler();

export interface Channel {
    key: ChannelKey;
    state: SamplerCurrentState;
    progress: number;
    patchGroupName?: string;
    patches: {
        order: Expressions[];
        byKey: PatchDef;
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
                channel.patches.order = Object.keys(def.patches) as any[];
                channel.patches.byKey = def.patches;
            });
            await sampler.load(channelKey, def.patches, (progress) => {
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
            store.update(s => {
                s.playback.sampler.channels.byKey[channel].assigned = instrumentKey;
            });
        },
        stopAll: () => {
            sampler.stopAll();
        },
        test: (channel: ChannelKey, patch: Expressions) => {
            sampler.play(channel, patch, 'C4', 0.80, 0.250, 0.000);
            sampler.play(channel, patch, 'D4', 0.85, 0.250, 0.250);
            sampler.play(channel, patch, 'E4', 0.90, 0.250, 0.500);
            sampler.play(channel, patch, 'F4', 0.95, 0.250, 0.750);
            sampler.play(channel, patch, 'G4', 1.00, 0.250, 1.000);
            sampler.play(channel, patch, 'F4', 0.95, 0.250, 1.250);
            sampler.play(channel, patch, 'E4', 0.90, 0.250, 1.500);
            sampler.play(channel, patch, 'D4', 0.85, 0.250, 1.750);
            sampler.play(channel, patch, 'C4', 0.80, 1.000, 2.000);
        }
    }
}