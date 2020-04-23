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
                    progress: 0,
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

            const notes: [string, number, number][] = [
                ['C4', 0.30, 0.250],
                ['D4', 0.40, 0.250],
                ['E4', 0.60, 0.250],
                ['F4', 0.80, 0.250],
                ['G4', 0.90, 0.250],
                ['F4', 0.80, 0.250],
                ['E4', 0.60, 0.250],
                ['D4', 0.40, 0.250],
                ['C4', 0.30, 1.000]
            ];

            // timing is not accurate but it is fine for a test
            notes.forEach(([pitch, velocity, duration], i) => {
                setTimeout(() => {
                    sampler.play(channel, patch, pitch, velocity, duration);
                }, 250 * i);
            });

        }
    }
}