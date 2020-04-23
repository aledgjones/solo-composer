import shortid from 'shortid';
import { APP_CREATOR } from '../const';
import { SoloSamplerChannel, ChannelKey } from './sampler-channel';
import { Pitch } from './utils';
import { PatchDef } from '../services/instrument-defs';
import { Expressions } from './expressions';

export type OutputProgressCallback = (progress: number) => void;

export enum SamplerCurrentState {
    loading = 1,
    ready,
    error
}

class SoloSampler {

    public id = shortid();
    public version = '1.0.0';
    public name = `Internal Sampler`;
    public manufacturer = APP_CREATOR;

    private channels: { [channel: string]: SoloSamplerChannel } = {};

    public load(channel: ChannelKey, patchUrls: PatchDef, progressCallback: OutputProgressCallback) {
        this.channels[channel] = new SoloSamplerChannel();
        return this.channels[channel].load(patchUrls, (val) => {
            progressCallback(val);
        });
    }

    public play(channel: ChannelKey, patch: Expressions, pitch: Pitch, velocity: number, duration: number) {
        const playback = this.channels[channel];
        playback.play(patch, pitch, velocity, duration);
    }

    public stopAll() {
        const channels = Object.keys(this.channels);
        channels.forEach(channel => {
            const ch = parseInt(channel);
            this.channels[ch].stopAll();
        });
    }
}

export const sampler = new SoloSampler();