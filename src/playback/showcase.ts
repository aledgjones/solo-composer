import { InstrumentPlayer } from "./instrument-player";
import { useEffect } from "react";

export function useShowcase() {
    useEffect(() => {

        async function run() {

            const ac = new AudioContext();

            const piano = new InstrumentPlayer(ac, ac.destination);
            await piano.load({ default: '/patches/grand-piano--piano.json' });
            piano.setGain(0.4);

            const solo = new InstrumentPlayer(ac, ac.destination);
            await solo.load({ default: '/patches/flute.json' });
            solo.setGain(1.0);

            solo.play('C5', 1.0, 1.5, 0.0);
            solo.play('Bb4', 0.8, 0.5, 1.5);
            solo.play('G4', 0.8, 0.5, 2.0);
            solo.play('F4', 0.8, 0.5, 2.5);
            solo.play('G4', 0.8, 5.0, 3.0);

            piano.play('C4', 0.4, 3.0, 1.0);
            piano.play('D#4', 0.4, 2.9, 1.1);
            piano.play('G4', 0.4, 2.8, 1.2);

            piano.play('C4', 0.4, 0.5, 4.0);
            piano.play('D#4', 0.5, 0.5, 4.5);
            piano.play('G4', 0.6, 1.0, 5.0);
            piano.play('D#4', 0.7, 2, 6.0);
            piano.play('D4', 0.8, 1, 6.0);
            piano.play('C4', 0.2, 1, 7.0);
            piano.play('C6', 0.8, 1.5, 4.0);
            piano.play('A#5', 0.6, 0.5, 5.5);
            piano.play('G5', 0.6, 0.5, 6.0);
            piano.play('F5', 0.6, 0.5, 6.5);
            piano.play('G5', 0.4, 1.0, 7.0);

        }

        run();

    }, []);




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