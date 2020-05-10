import {Store} from "pullstate";
import shortid from "shortid";

import INFO from "../info.json";
import {State} from "./state";
import {InstrumentKey} from "./instrument";
import {InstrumentDef} from "./instrument-defs";
import {Expressions} from "../playback/expressions";
import {PatchPlayer} from "../playback/patch-player";

export type ChannelKey = string;

export enum SamplerCurrentState {
    loading = 1,
    ready,
    error
}

export interface Channel {
    key: ChannelKey;
    state: SamplerCurrentState;
    progress: number;
    patchGroupName?: string;
    patches: {
        order: Expressions[];
        byKey: {
            [patchKey: string]: PatchPlayer;
        };
    };
    assigned?: InstrumentKey;
}

export interface ChannelState {
    order: ChannelKey[];
    byKey: {
        [channel: string]: Channel;
    };
}

export interface SamplerState {
    name: string;
    version: string;
    manufacturer: string;
    channels: ChannelState;
}

export const samplerEmptyState = (): SamplerState => {
    return {
        name: "Internal Sampler",
        version: "1.0.0",
        manufacturer: INFO.CREATOR,
        channels: {
            order: [],
            byKey: {}
        }
    };
};

export const samplerActions = (store: Store<State>) => {
    return {
        createChannel: () => {
            const channelKey = shortid();
            store.update((s) => {
                s.playback.sampler.channels.order.push(channelKey);
                s.playback.sampler.channels.byKey[channelKey] = {
                    key: channelKey,
                    state: SamplerCurrentState.ready,
                    progress: 0,
                    patches: {
                        order: [],
                        byKey: {}
                    }
                };
            });
            return channelKey;
        },
        load: async (channelKey: ChannelKey, def: InstrumentDef) => {
            store.update((s) => {
                const channel = s.playback.sampler.channels.byKey[channelKey];
                channel.state = SamplerCurrentState.loading;
                channel.patchGroupName = def.id;
            });

            const expressions = Object.keys(def.patches) as Expressions[];
            const count = expressions.length;
            let completed = 0;

            await Promise.all(
                expressions.map(async (expression: Expressions) => {
                    const patchUrl = def.patches[expression];
                    const player = new PatchPlayer();
                    await player.loadPatch(patchUrl);
                    completed++;
                    store.update((s) => {
                        const channel = s.playback.sampler.channels.byKey[channelKey];
                        channel.patches.order.push(expression);
                        channel.patches.byKey[expression] = player;
                        channel.progress = completed / count;
                    });
                })
            );

            store.update((s) => {
                const channel = s.playback.sampler.channels.byKey[channelKey];
                channel.state = SamplerCurrentState.ready;
            });
        },
        assignInstrument: (instrumentKey: InstrumentKey, channel: ChannelKey) => {
            store.update((s) => {
                s.playback.sampler.channels.byKey[channel].assigned = instrumentKey;
            });
        },
        test: (channel: ChannelKey) => {
            const state = store.getRawState();
            const patch = state.playback.sampler.channels.byKey[channel].patches.byKey[Expressions.natural];

            const notes: [string, number, number][] = [
                ["C4", 0.3, 0.25],
                ["D4", 0.4, 0.25],
                ["E4", 0.6, 0.25],
                ["F4", 0.8, 0.25],
                ["G4", 0.9, 0.25],
                ["F4", 0.8, 0.25],
                ["E4", 0.6, 0.25],
                ["D4", 0.4, 0.25],
                ["C4", 0.3, 1.0]
            ];

            // timing is not accurate but it is fine for a test
            notes.forEach(([pitch, velocity, duration], i) => {
                setTimeout(() => {
                    patch.play(pitch, velocity, duration);
                }, 250 * i);
            });
        }
    };
};
