import { PatchPlayer, Pitch } from "./patch-player";

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

    public play(patch: string, pitch: Pitch, velocity: number, duration: number, when?: number) {
        const output = this.patches[patch] || this.patches['default'];
        output.play(pitch, velocity, duration, when);
    }
}