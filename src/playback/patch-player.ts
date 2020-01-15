import { decode } from 'base64-arraybuffer';
import { Envelope, envelope } from './envelope';
import { Pitch, toMidiPitchNumber, toMidiPitchString } from './utils';

interface PatchFromFile {
    envelope: Envelope;
    samples: {
        [note: string]: {
            looped: boolean;
            loop_start: number;
            loop_end: number;
            tune: number;
            data: string;
        }
    }
}

interface Samples {
    [note: string]: AudioBuffer;
}

export class PatchPlayer {

    private defaultEnvelope(): Envelope {
        return {
            attackTime: 0.0,
            decayTime: 1.0,
            peakLevel: 1.0,
            sustainLevel: 0.8,
            releaseTime: 1.0,
            gateTime: 2.0,
            releaseCurve: "exp"
        }
    };

    private millisecondsToSeconds(ms: number) {
        return ms / 1000;
    }

    private envelope = this.defaultEnvelope();
    private samples: Samples = {};
    private getMIDIPitchValue = toMidiPitchNumber;
    private nodes: AudioBufferSourceNode[] = [];

    constructor(private ac: AudioContext, private destination: GainNode) { };

    private getSample(pitch: Pitch) {

        const MIDIPitchValue = this.getMIDIPitchValue(pitch);

        if (this.samples[MIDIPitchValue]) {
            return { buffer: this.samples[MIDIPitchValue], detune: 0 };
        } else {
            const pitches = Object.keys(this.samples);
            const closest = pitches.reduce<number>((prev, curr) => {
                return (Math.abs(parseInt(curr) - MIDIPitchValue) < Math.abs(prev - MIDIPitchValue) ? parseInt(curr) : prev);
            }, parseInt(pitches[0]));
            return { buffer: this.samples[closest], detune: 100 * (MIDIPitchValue - closest) };
        }

    }

    public async loadPatch(url: string) {

        this.envelope = this.defaultEnvelope();
        this.samples = {};

        const resp = await fetch(url);
        const data: PatchFromFile = await resp.json();

        const keys = Object.keys(data.samples);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const entry = data.samples[key];
            const buffer = decode(entry.data);
            const audio = await this.ac.decodeAudioData(buffer);
            const MIDICode = this.getMIDIPitchValue(key);
            this.samples[MIDICode] = audio;
        }

    }

    /**
     * Play a patch
     *
     * @param pitch         eg. C4
     * @param velocity      1-127
     * @param duration      ms
     * @param when          ms 
     */
    public play(pitch: Pitch, velocity: number, duration: number, when: number = 0) {

        console.log(toMidiPitchString(pitch), when);

        const { buffer, detune } = this.getSample(pitch);

        const velocityNode = this.ac.createGain();
        velocityNode.gain.value = velocity / 127.0;

        const sourceNode = this.ac.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.detune.value = detune;

        const startAt = this.ac.currentTime + this.millisecondsToSeconds(when);
        const env = envelope(this.ac, startAt, { ...this.envelope, gateTime: this.millisecondsToSeconds(duration) });

        sourceNode.connect(env.node);
        env.node.connect(velocityNode);
        velocityNode.connect(this.destination);

        sourceNode.start(startAt, 0, env.duration);

        sourceNode.onended = () => {
            sourceNode.disconnect();
            env.node.disconnect();
            velocityNode.disconnect();
            this.nodes = this.nodes.filter(node => {
                return node !== sourceNode;
            });
        }

        this.nodes.push(sourceNode);

    }

    public stopAll() {
        this.nodes.forEach(node => node.stop(0));
    }

}