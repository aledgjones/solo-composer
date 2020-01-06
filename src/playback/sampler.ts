import shortid from 'shortid';
import { Output, OutputType, Listener, Action, ChannelKey } from "./output";
import { APP_SHORT_NAME, APP_CREATOR } from '../const';
import { InstrumentPlayer } from './instrument-player';
import { SAMPLER_SET_STATE, SAMPLER_SET_PROGRESS, SAMPLER_LOAD_PATCHES } from '../services/sampler';
import { Pitch } from './patch-player';

export interface Patches {
    [patchKey: string]: string;
}

export enum SamplerCurrentState {
    loading = 1,
    ready,
    error
}

export class Sampler implements Output {

    public id = shortid();
    public name = `${APP_SHORT_NAME} Internal Sampler`;
    public manufacturer = APP_CREATOR;
    public type = OutputType.sampler;

    private audioContext = new AudioContext();
    private channels: { [channel: string]: InstrumentPlayer } = {};
    private listeners: Listener[] = [];

    public async load(channel: string, patchUrls: Patches, patchName: string) {

        const keys = Object.keys(patchUrls);
        const patches = keys.map(key => patchUrls[key]);

        this.dispatch({ type: SAMPLER_LOAD_PATCHES, payload: { patches, channel, patchName } });
        this.channels[channel] = new InstrumentPlayer(this.audioContext);
        await this.channels[channel].load(patchUrls, (val) => {
            this.dispatch({ type: SAMPLER_SET_PROGRESS, payload: { progress: val, channel } });
        });
        this.dispatch({ type: SAMPLER_SET_STATE, payload: { state: SamplerCurrentState.ready, channel } });

    }

    public play(channel: ChannelKey, patch: string, pitch: Pitch, velocity: number, duration: number, when?: number) {
        const playback = this.channels[channel];
        playback.play(patch, pitch, velocity, duration, when);
    }

    private dispatch(action: Action) {
        this.listeners.forEach(cb => cb(action));
    }

    public listen(cb: Listener) {
        this.listeners.push(cb);
    }
}