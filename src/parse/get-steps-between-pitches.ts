import { Pitch } from "../playback/patch-player";

function splitPitch(pitch: Pitch) {
    return { note: pitch.slice(0, 1), octave: parseInt(pitch.slice(-1)) };
}

export function getStepsBetweenPitces(pitchA: Pitch, pitchB: Pitch) {
    const row = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const { note: pitchANote, octave: pitchAOctave } = splitPitch(pitchA);
    const { note: pitchBNote, octave: pitchBOctave } = splitPitch(pitchB);
    const octaveOffset = (pitchBOctave - pitchAOctave) * 7;
    return octaveOffset + row.indexOf(pitchBNote) - row.indexOf(pitchANote);
}