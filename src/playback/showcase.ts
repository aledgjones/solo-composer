import { InstrumentPlayer } from "./instrument-player";

export async function showcase() {

    const ac = new AudioContext();

    // const piano = new InstrumentPlayer(ac, ac.destination);
    // await piano.load({ default: '/patches/grand-piano--piano.json' });
    // piano.setGain(.6);

    const solo = new InstrumentPlayer(ac, ac.destination);
    await solo.load({ default: '/patches/cor-anglais-solo--sustain.json' });
    solo.setGain(.8);

    console.log(solo);

    return () => {

        solo.play('F4', 1.0, 10.0, 0.0);

        // solo.play('C4', 1.0, 1.5, 0.0);
        // solo.play('A#3', 0.8, 0.5, 1.5);
        // solo.play('G3', 0.8, 0.5, 2.0);
        // solo.play('F3', 0.8, 0.5, 2.5);
        // solo.play('G3', 0.8, 5.0, 3.0);

        // piano.play('C4', 0.4, 3.0, 1.0);
        // piano.play('D#4', 0.4, 2.9, 1.1);
        // piano.play('G4', 0.4, 2.8, 1.2);

        // piano.play('C4', 0.4, 0.5, 4.0);
        // piano.play('D#4', 0.5, 0.5, 4.5);
        // piano.play('G4', 0.6, 1.0, 5.0);
        // piano.play('D#4', 0.7, 2, 6.0);
        // piano.play('D4', 0.8, 1, 6.0);
        // piano.play('C4', 0.2, 1, 7.0);
        // piano.play('C6', 0.8, 1.5, 4.0);
        // piano.play('A#5', 0.6, 0.5, 5.5);
        // piano.play('G5', 0.6, 0.5, 6.0);
        // piano.play('F5', 0.6, 0.5, 6.5);
        // piano.play('G5', 0.4, 1.0, 7.0);

    }





    // const midi = await window.navigator.requestMIDIAccess();
    // midi.inputs.forEach((input: any) => {
    //     input.onmidimessage = (e: any) => {
    //         const [type, pitch, velocity] = e.data;
    //         if (type === 144) {
    //             player.play(pitch + 12, 1);
    //         }
    //     }
    // });
};