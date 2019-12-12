import { PatchPlayer, Pitch } from "./patch-player";

export class InstrumentPlayer {

    private patch?: PatchPlayer;
    private patches: { [patchName: string]: PatchPlayer } = {};
    private gainNode: GainNode;

    constructor(private ac: AudioContext, destination: AudioDestinationNode) {
        this.gainNode = ac.createGain();
        this.gainNode.connect(destination);
    }

    public setGain(value: number) {
        this.gainNode.gain.value = value;
    }

    public async load(patchUrls: { [patchName: string]: string }, progress?: (val: number) => void) {
        const patchNames = Object.keys(patchUrls);
        const total = patchNames.length;
        let completed = 0;
        const loaders = patchNames.map(async name => {
            this.patches[name] = new PatchPlayer(this.ac, this.gainNode);
            await this.patches[name].loadPatch(patchUrls[name]);
            completed++;
            if (progress) {
                progress(completed / total);
            }
        });
        await Promise.all(loaders);
        this.patch = this.patches[patchNames[0]];
        return this;
    }

    public toPatch(name: string) {
        if (this.patches[name]) {
            this.patch = this.patches[name]
        } else {
            console.warn(`Patch ${name} does not exist on this instrument. Try:`);
            const keys = Object.keys(this.patches);
            keys.forEach(key => console.warn(key));
        }
    }

    public play(pitch: Pitch, velocity: number, duration: number, when?: number) {
        if (this.patch) {
            this.patch.play(pitch, velocity, duration, when);
        }
    }
}