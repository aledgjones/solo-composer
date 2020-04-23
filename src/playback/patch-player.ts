import { Sampler } from 'tone';
import { Pitch } from './utils';

interface PatchFromFile {
    envelope: {
        attack: number;
        release: number;
    };
    samples: {
        [note: string]: string;
    }
}

export class PatchPlayer {

    private sampler = new Sampler().toDestination();

    public async loadPatch(url: string) {

        const resp = await fetch(url);
        const data: PatchFromFile = await resp.json();

        const pitches = Object.keys(data.samples);
        this.sampler.attack = data.envelope.attack;
        this.sampler.release = data.envelope.release;

        for (let i = 0; i < pitches.length; i++) {
            const pitch = pitches[i] as any;
            await new Promise(resolve => {
                this.sampler.add(pitch, data.samples[pitches[i]], resolve);
            });
        }

    }

    /**
     * Play a patch
     */
    public play(pitch: Pitch, velocity: number, duration: number) {
        this.sampler.triggerAttackRelease(pitch, duration, undefined, velocity);
    }

    public stopAll() {
        this.sampler.releaseAll();
    }

}