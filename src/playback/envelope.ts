import Envelope from 'adsr-envelope';

export interface Envelope {
    attackTime: number;
    decayTime: number;
    peakLevel: number;
    sustainLevel: number;
    releaseTime: number;
    gateTime: number;
    releaseCurve: string;
}

export function envelope(ac: AudioContext, startAt: number, opts: Envelope) {
    const node = ac.createGain();
    const env = new Envelope(opts);
    env.applyTo(node.gain, startAt);
    const duration: number = env.duration;
    return { node, duration };
}