import { Sampler, Destination } from 'tone';
import { Pitch, toMidiPitchString } from './utils';
import { Time } from 'tone/build/esm/core/type/Units';

interface PatchFromFile {
    envelope: {
        attack: number;
        release: number;
    };
    samples: {
        [note: string]: string;
    }
}

export class SoloSamplerPatch {

    private sampler = new Sampler().connect(Destination);

    public async loadPatch(url: string) {

        const resp = await fetch(url);
        const data: PatchFromFile = await resp.json();

        const keys = Object.keys(data.samples);
        this.sampler.attack = data.envelope.attack;
        this.sampler.release = data.envelope.release;

        for (let i = 0; i < keys.length; i++) {
            const pitch = toMidiPitchString(keys[i]) as any;
            await new Promise(resolve => {
                this.sampler.add(pitch, data.samples[keys[i]], resolve);
            });
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
    public play(pitch: Pitch, velocity: number, duration: Time, when: Time = 0) {
        const note = toMidiPitchString(pitch);
        console.log(this.sampler);
        this.sampler.triggerAttackRelease(note, duration, when, velocity);
    }

    public stopAll() {
        console.log('stop all');
    }

}