import { SoloSamplerPatch } from "./sampler-patch";
import { Expressions } from "./expressions";
import { Pitch } from "./utils";

export type ChannelKey = string;

export class SoloSamplerChannel {

    private patches: { [expression: string]: SoloSamplerPatch } = {};

    public async load(patchUrls: { [expression: string]: string }, progress?: (val: number) => void) {
        const expressions = Object.keys(patchUrls);
        const total = expressions.length;
        let completed = 0;
        const loaders = expressions.map(async expression => {
            this.patches[expression] = new SoloSamplerPatch();
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
     */
    public play(patch: string, pitch: Pitch, velocity: number, duration: number) {
        const output = this.patches[patch] || this.patches[Expressions.natural];
        output.play(pitch, velocity, duration);
    }

    public stopAll() {
        const patches = Object.keys(this.patches);
        patches.forEach(patch => {
            this.patches[patch].stopAll();
        })
    }
}