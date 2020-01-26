import shortid from 'shortid';
import { Output, OutputType, ChannelKey, OutputProgressCallback } from "./output";
import { APP_SHORT_NAME, APP_CREATOR } from '../const';
import { InstrumentPlayer } from './instrument-player';
import { Pitch } from './utils';

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

    public load(channel: ChannelKey, patchUrls: Patches, patchName: string, progressCallback: OutputProgressCallback) {
        this.channels[channel] = new InstrumentPlayer(this.audioContext);
        return this.channels[channel].load(patchUrls, (val) => {
            progressCallback(val);
        });
    }

    public play(channel: ChannelKey, patch: string, pitch: Pitch, velocity: number, duration: number, when?: number) {
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