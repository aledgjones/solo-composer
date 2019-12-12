
import { decode } from 'base64-arraybuffer';
import { isString } from 'lodash';
import { Envelope, envelope } from './envelope';

export type Pitch = string | number;

interface PatchFromFile {
    envelope: Envelope;
    samples: {
        [note: string]: {
            loop: boolean;
            loopStart: number;
            loopEnd: number;
            data: string;
        }
    }
}

interface Patch {
    envelope: Envelope;
    samples: {
        [note: string]: {
            loop: boolean;
            loopStart: number;
            loopEnd: number;
            buffer: AudioBuffer;
        }
    }
}

export class PatchPlayer {

    private patch: Patch = { envelope: this.defaultEnvelope(), samples: {} };

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

    constructor(private ac: AudioContext, private destination: GainNode) { };

    private getMIDIPitchValue(pitch: Pitch) {

        if (isString(pitch)) {
            const C0 = 24;
            const letters = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

            const octave = parseInt(pitch.slice(-1));
            const note = pitch.slice(0, -1);
            const output = C0 + (octave * 12) + letters.indexOf(note);

            return output;
        } else {
            return pitch;
        }

    }

    private getSample(pitch: Pitch) {

        const MIDIPitchValue = this.getMIDIPitchValue(pitch);

        if (this.patch.samples[MIDIPitchValue]) {
            return { ...this.patch.samples[MIDIPitchValue], detune: 0 };
        } else {
            const pitches = Object.keys(this.patch.samples);
            const closest = pitches.reduce<number>((prev, curr) => {
                return (Math.abs(parseInt(curr) - MIDIPitchValue) < Math.abs(prev - MIDIPitchValue) ? parseInt(curr) : prev);
            }, parseInt(pitches[0]));
            return { ...this.patch.samples[closest], detune: 100 * (MIDIPitchValue - closest) };
        }

    }

    public async loadPatch(url: string) {

        const resp = await fetch(url);
        const data: PatchFromFile = await resp.json();

        this.patch = { envelope: data.envelope, samples: {} };

        const keys = Object.keys(data.samples);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const entry = data.samples[key];
            const buffer = decode(entry.data);
            const audio = await this.ac.decodeAudioData(buffer);
            const sampleTime = 1 / audio.sampleRate;
            const MIDICode = this.getMIDIPitchValue(key);
            this.patch.samples[MIDICode] = {
                loop: entry.loop,
                loopStart: entry.loopStart * sampleTime,
                loopEnd: entry.loopEnd * sampleTime,
                buffer: audio
            }
        }

    }

    public play(pitch: number | string, velocity: number, duration: number, when: number = 0) {

        const { loop, loopStart, loopEnd, buffer, detune } = this.getSample(pitch);

        const velocityNode = this.ac.createGain();
        velocityNode.gain.value = velocity;

        const sourceNode = this.ac.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.detune.value = detune;
        if (loop) {
            sourceNode.loop = true;
            sourceNode.loopStart = loopStart / buffer.sampleRate;
            sourceNode.loopEnd = loopEnd / buffer.sampleRate;
        }

        const startAt = this.ac.currentTime + when;
        const env = envelope(this.ac, startAt, { ...this.patch.envelope, gateTime: duration });
        const stopAt = startAt + env.duration;

        sourceNode.connect(env.node);
        env.node.connect(velocityNode);
        velocityNode.connect(this.destination);

        sourceNode.start(startAt);
        sourceNode.stop(stopAt);

        sourceNode.onended = () => {
            sourceNode.disconnect();
            env.node.disconnect();
            velocityNode.disconnect();
        }

    }



}