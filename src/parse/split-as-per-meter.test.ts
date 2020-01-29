import { splitAsPerMeter } from "./split-as-per-meter";
import { createTimeSignature } from "../entries/time-signature";
import { getDefaultGroupings } from "./get-default-groupings";
import { NotationTrack } from "./notation-track";
import { EntriesByTick } from "../services/track";
import { getFirstBeats } from "./get-first-beats";
import { createTone } from "../entries/tone";
import { debugNotationTrack } from "../debug/debug-notation-track";

let i = 1;

it(i + '. ' + 'splits notes at barlines only - 2/4', () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const tone = createTone({pitch: 'C4', duration: 0}, 0);

    const track: NotationTrack = {
        [0]: { key: 'a', tones: [tone], duration: len, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugNotationTrack(len, output);

    expect(log).toBe('o_______________________o----------------------¬');
});

// i++;

// it(i + '. ' + 'splits rests at barlines only - 2/4', () => {
//     const c = 12;
//     const len = c * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------¬r----------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar rest as such - 2/4', () => {
//     const c = 12;
//     const len = c * 2;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar rest as such - 6/8', () => {
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar rest as such - 3/4', () => {
//     const c = 12;
//     const len = c * 3;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar rest as such - 9/8', () => {
//     const q = 6;
//     const len = q * 9;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar rest as such - 4/4', () => {
//     const c = 12;
//     const len = c * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar rest as such - 12/8', () => {
//     const q = 6;
//     const len = q * 12;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------------------------------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar rest as such - 5/8', () => {
//     const q = 6;
//     const len = q * 5;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 5, beatType: 8, groupings: getDefaultGroupings(5), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar rest as such - 7/8', () => {
//     const q = 6;
//     const len = q * 7;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 7, beatType: 8, groupings: getDefaultGroupings(7), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar note as such - 2/4', () => {
//     const c = 12;
//     const len = c * 2;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar note as such - 6/8', () => {
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar note as such - 3/4', () => {
//     const c = 12;
//     const len = c * 3;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar note as such - 9/8', () => {
//     const q = 6;
//     const len = q * 9;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o___________________________________o----------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar note as such - 4/4', () => {
//     const c = 12;
//     const len = c * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------------------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar note as such - 12/8', () => {
//     const q = 6;
//     const len = q * 12;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------------------------------------------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar note as such - 5/8', () => {
//     const q = 6;
//     const len = q * 5;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 5, beatType: 8, groupings: getDefaultGroupings(5), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o_________________o----------¬');
// });

// i++

// it(i + '. ' + 'renders a full bar note as such - 7/8', () => {
//     const q = 6;
//     const len = q * 7;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 7, beatType: 8, groupings: getDefaultGroupings(7), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: len, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o_________________o----------------------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 4/4 [c---]', () => {
//     const c = 12;
//     const len = c * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: c * 1, type: NotationType.note, ties: [] },
//         [c * 1]: { tones: ['b'], duration: c * 3, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------¬r----------¬r----------------------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 4/4 [c--c]', () => {
//     const c = 12;
//     const len = c * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [c * 0]: { tones: ['a'], duration: c * 1, type: NotationType.note, ties: [] },
//         [c * 1]: { tones: ['b'], duration: c * 2, type: NotationType.rest, ties: [] },
//         [c * 3]: { tones: ['c'], duration: c * 1, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------¬r----------¬r----------¬o----------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 4/4 [---c]', () => {
//     const c = 12;
//     const len = c * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: c * 3, type: NotationType.rest, ties: [] },
//         [c * 3]: { tones: ['b'], duration: c * 1, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------¬r----------¬o----------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 6/8 [q-----]', () => {

//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q, type: NotationType.note, ties: [] },
//         [q]: { tones: ['b'], duration: q * 5, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬r----¬r----¬r----------------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 6/8 [c--c]', () => {
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 2, type: NotationType.note, ties: [] },
//         [q * 2]: { tones: ['b'], duration: q * 2, type: NotationType.rest, ties: [] },
//         [q * 4]: { tones: ['c'], duration: q * 2, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------¬r----¬r----¬o----------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 6/8 [-----q]', () => {
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 5, type: NotationType.rest, ties: [] },
//         [q * 5]: { tones: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------¬r----¬r----¬o----¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 12/8 [q-----------]', () => {
//     const q = 6;
//     const len = q * 12;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
//         [q * 1]: { tones: ['b'], duration: q * 11, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬r----¬r----¬r----------------¬r----------------------------------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 12/8 [q----------q]', () => {
//     const q = 6;
//     const len = q * 12;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
//         [q * 1]: { tones: ['b'], duration: q * 10, type: NotationType.rest, ties: [] },
//         [q * 11]: { tones: ['c'], duration: q * 1, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬r----¬r----¬r----------------¬r----------------¬r----¬r----¬o----¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 12/8 [-----------q]', () => {
//     const q = 6;
//     const len = q * 12;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 11, type: NotationType.rest, ties: [] },
//         [q * 11]: { tones: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------------------------¬r----------------¬r----¬r----¬o----¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 3/4 [c--]', () => {
//     const c = 12;
//     const len = c * 3;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: c * 1, type: NotationType.note, ties: [] },
//         [c * 1]: { tones: ['b'], duration: c * 2, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------¬r----------¬r----------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 3/4 [--c]', () => {
//     const c = 12;
//     const len = c * 3;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: c * 2, type: NotationType.rest, ties: [] },
//         [c * 2]: { tones: ['b'], duration: c * 1, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------¬r----------¬o----------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 9/8 [c.------]', () => {
//     const q = 6;
//     const len = q * 9;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 3, type: NotationType.note, ties: [] },
//         [q * 3]: { tones: ['b'], duration: q * 6, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------------¬r----------------¬r----------------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 9/8 [------c.]', () => {
//     const q = 6;
//     const len = q * 9;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 6, type: NotationType.rest, ties: [] },
//         [q * 6]: { tones: ['b'], duration: q * 3, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------------¬r----------------¬o----------------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 2/4 [----s]', () => {
//     const q = 6;
//     const sq = 3;
//     const len = q * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: (q * 3) + sq, type: NotationType.rest, ties: [] },
//         [(q * 3) + sq]: { tones: ['b'], duration: sq, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('r----------¬r-------¬o-¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 6/8 [c_ss---]', () => {
//     const q = 6;
//     const sq = 3;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: sq * 5, type: NotationType.note, ties: [] },
//         [sq * 5]: { tones: ['b'], duration: sq, type: NotationType.note, ties: [] },
//         [sq * 6]: { tones: ['c'], duration: q * 3, type: NotationType.rest, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o___________o-¬o-¬r----------------¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 2/4 [qcq]', () => {
//     const q = 6;
//     const len = q * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q, type: NotationType.note, ties: [] },
//         [q]: { tones: ['b'], duration: q * 2, type: NotationType.note, ties: [] },
//         [q * 3]: { tones: ['b'], duration: q, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬o----------¬o----¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 2/4 [sq._c]', () => {
//     const q = 6;
//     const sq = 3;
//     const len = q * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: sq, type: NotationType.note, ties: [] },
//         [sq]: { tones: ['b'], duration: sq * 7, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o-¬o________o----------¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 3/4 [m_qq]', () => {
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 5, type: NotationType.note, ties: [] },
//         [q * 5]: { tones: ['a'], duration: q, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o_______________________o----¬o----¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 3/4 [qq_c.q]', () => {
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q, type: NotationType.note, ties: [] },
//         [q]: { tones: ['a'], duration: q * 4, type: NotationType.note, ties: [] },
//         [q * 5]: { tones: ['b'], duration: q, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬o_____o----------------¬o----¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 3/4 [c.q_c]', () => {
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 3, type: NotationType.note, ties: [] },
//         [q * 3]: { tones: ['b'], duration: q * 3, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------------¬o_____o----------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 3/4 [qq_m]', () => {
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
//         [q * 1]: { tones: ['b'], duration: q * 5, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬o_____o----------------------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 6/8 [qc_c.]', () => {
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
//         [q * 1]: { tones: ['b'], duration: q * 5, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬o___________o----------------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 6/8 [q.s_q_c.]', () => {
//     const sq = 3;
//     const q = 6;
//     const len = q * 6;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: sq * 3, type: NotationType.note, ties: [] },
//         [sq * 3]: { tones: ['b'], duration: sq * 9, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o-------¬o__o_____o----------------¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 9/8 [m._cq]', () => {
//     const q = 6;
//     const len = q * 9;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 8, type: NotationType.note, ties: [] },
//         [q * 8]: { tones: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o___________________________________o----------¬o----¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 2/4 [qq.]', () => {
//     const q = 6;
//     const len = q * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q, type: NotationType.note, ties: [] },
//         [q]: { tones: ['b'], duration: q * 3, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬o----------------¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 2/4 [q.q]', () => {
//     const q = 6;
//     const len = q * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 3, type: NotationType.note, ties: [] },
//         [q * 3]: { tones: ['b'], duration: q, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------------¬o----¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 4/4 [cm.]', () => {
//     const c = 12;
//     const len = c * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: c, type: NotationType.note, ties: [] },
//         [c]: { tones: ['b'], duration: c * 3, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------¬o----------------------------------¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 4/4 [m.c]', () => {
//     const c = 12;
//     const len = c * 4;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: c * 3, type: NotationType.note, ties: [] },
//         [c * 3]: { tones: ['b'], duration: c, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----------------------------------¬o----------¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 4/4 [sq._c_m]', () => {
//     const q = 6;
//     const sq = 3;
//     const len = q * 8;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: sq, type: NotationType.note, ties: [] },
//         [sq]: { tones: ['b'], duration: sq * 15, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o-¬o________o___________o----------------------¬');
// });

// i++;

// it(i + '. ' + 'renders correctly - 4/4 [qc._qcq]', () => {
//     const q = 6;
//     const len = q * 8;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
//         [q * 1]: { tones: ['b'], duration: q * 4, type: NotationType.note, ties: [] },
//         [q * 5]: { tones: ['b'], duration: q * 2, type: NotationType.note, ties: [] },
//         [q * 7]: { tones: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬o_________________o----¬o----------¬o----¬');
// });

// i++

// it(i + '. ' + 'renders correctly - 4/4 [qqqq_c.q]', () => {
//     const q = 6;
//     const len = q * 8;

//     const flow: EntriesByTick = {
//         [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
//     }

//     const track: NotationTrack = {
//         [0]: { tones: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
//         [q * 1]: { tones: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
//         [q * 2]: { tones: ['b'], duration: q * 1, type: NotationType.note, ties: [] },
//         [q * 3]: { tones: ['b'], duration: q * 4, type: NotationType.note, ties: [] },
//         [q * 7]: { tones: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
//     }

//     const barlines = getFirstBeats(len, flow);
//     const output = splitAsPerMeter(len, flow, track, barlines);
//     const log = debugTrack(len, output);

//     expect(log).toBe('o----¬o----¬o----¬o_____o----------------¬o----¬');
// });

// i++;