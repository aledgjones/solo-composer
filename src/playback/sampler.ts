import shortid from 'shortid';
import { APP_SHORT_NAME, APP_CREATOR } from '../const';
import { SoloSamplerChannel, ChannelKey } from './sampler-channel';
import { Pitch } from './utils';
import { PatchDef } from '../services/instrument-defs';
import { Expressions } from './expressions';
import { Time } from 'tone/build/esm/core/type/Units';

export type OutputProgressCallback = (progress: number) => void;

export enum SamplerCurrentState {
    loading = 1,
    ready,
    error
}

export class SoloSampler {

    public id = shortid();
    public name = `${APP_SHORT_NAME} Internal Sampler`;
    public manufacturer = APP_CREATOR;

    private channels: { [channel: string]: SoloSamplerChannel } = {};

    public load(channel: ChannelKey, patchUrls: PatchDef, progressCallback: OutputProgressCallback) {
        this.channels[channel] = new SoloSamplerChannel();
        return this.channels[channel].load(patchUrls, (val) => {
            progressCallback(val);
        });
    }

    public play(channel: ChannelKey, patch: Expressions, pitch: Pitch, velocity: number, duration: Time, when?: Time) {
        const playback = this.channels[channel];
        playback.play(patch, pitch, velocity, duration, when);
    }

    public stopAll() {
        const channels = Object.keys(this.channels);
        channels.forEach(channel => {
            const ch = parseInt(channel);
            this.channels[ch].stopAll();
        })
    }
}