import { PatchPlayer } from "./patch-player";
import { Expressions } from "./expressions";
import { Pitch } from "./utils";

export class InstrumentPlayer {

    private patches: { [patchName: string]: PatchPlayer } = {};
    private gainNode: GainNode;

    constructor(private ac: AudioContext) {
        this.gainNode = ac.createGain();
        this.gainNode.connect(ac.destination);
    }

    public gain(value: number) {
        this.gainNode.gain.value = value;
    }

    public async load(patchUrls: { [expression: string]: string }, progress?: (val: number) => void) {
        const expressions = Object.keys(patchUrls);
        const total = expressions.length;
        let completed = 0;
        const loaders = expressions.map(async expression => {
            this.patches[expression] = new PatchPlayer(this.ac, this.gainNode);
            await this.patches[expression].loadPatch(patchUrls[expression]);
            completed++;
            if (progress) {
                progress(completed / total);
            }
        });
        await Promise.all(loaders);
    }

    /**
     * Play a patch
     *
     * @param pitch         eg. C4
     * @param velocity      1-127
     * @param duration      ms
     * @param when          ms 
     */
    public play(patch: string, pitch: Pitch, velocity: number, duration: number, when?: number) {
        const output = this.patches[patch] || this.patches[Expressions.natural];
        output.play(pitch, velocity, duration, when);
    }

    public stopAll() {
        const patches = Object.keys(this.patches);
        patches.forEach(patch => {
            this.patches[patch].stopAll();
        })
    }
}