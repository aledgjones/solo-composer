import { splitAsPerMeter } from "./split-as-per-meter";
import { createTimeSignature } from "../entries/time-signature";
import { getDefaultGroupings } from "./get-default-groupings";
import { NotationTrack, NotationType } from "./notation-track";
import { EntriesByTick } from "../services/track";
import { debugTrack } from "../debug/debug-track";
import { getFirstBeats } from "./get-first-beats";

let i = 1;

it(i + '. ' + 'splits notes at barlines only - 2/4', () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o_______________________o----------------------¬');
});

i++;

it(i + '. ' + 'splits rests at barlines only - 2/4', () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------¬r----------------------¬');
});

i++

it(i + '. ' + 'renders a full bar rest as such - 2/4', () => {
    const c = 12;
    const len = c * 2;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------¬');
});

i++

it(i + '. ' + 'renders a full bar rest as such - 6/8', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar rest as such - 3/4', () => {
    const c = 12;
    const len = c * 3;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar rest as such - 9/8', () => {
    const q = 6;
    const len = q * 9;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar rest as such - 4/4', () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar rest as such - 12/8', () => {
    const q = 6;
    const len = q * 12;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------------------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar rest as such - 5/8', () => {
    const q = 6;
    const len = q * 5;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 5, beatType: 8, groupings: getDefaultGroupings(5), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar rest as such - 7/8', () => {
    const q = 6;
    const len = q * 7;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 7, beatType: 8, groupings: getDefaultGroupings(7), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar note as such - 2/4', () => {
    const c = 12;
    const len = c * 2;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------------------¬');
});

i++

it(i + '. ' + 'renders a full bar note as such - 6/8', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar note as such - 3/4', () => {
    const c = 12;
    const len = c * 3;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar note as such - 9/8', () => {
    const q = 6;
    const len = q * 9;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o___________________________________o----------------¬');
});

i++

it(i + '. ' + 'renders a full bar note as such - 4/4', () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------------------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar note as such - 12/8', () => {
    const q = 6;
    const len = q * 12;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------------------------------------------------------------------¬');
});

i++

it(i + '. ' + 'renders a full bar note as such - 5/8', () => {
    const q = 6;
    const len = q * 5;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 5, beatType: 8, groupings: getDefaultGroupings(5), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o_________________o----------¬');
});

i++

it(i + '. ' + 'renders a full bar note as such - 7/8', () => {
    const q = 6;
    const len = q * 7;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 7, beatType: 8, groupings: getDefaultGroupings(7), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o_________________o----------------------¬');
});

i++

it(i + '. ' + 'renders correctly - 4/4 [c---]', () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: c * 1, type: NotationType.note, ties: [] },
        [c * 1]: { tick: c * 1, keys: ['b'], duration: c * 3, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------¬r----------¬r----------------------¬');
});

i++

it(i + '. ' + 'renders correctly - 4/4 [c--c]', () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [c * 0]: { tick: 0, keys: ['a'], duration: c * 1, type: NotationType.note, ties: [] },
        [c * 1]: { tick: c * 1, keys: ['b'], duration: c * 2, type: NotationType.rest, ties: [] },
        [c * 3]: { tick: c * 3, keys: ['c'], duration: c * 1, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------¬r----------¬r----------¬o----------¬');
});

i++

it(i + '. ' + 'renders correctly - 4/4 [---c]', () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: c * 3, type: NotationType.rest, ties: [] },
        [c * 3]: { tick: c * 3, keys: ['b'], duration: c * 1, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------¬r----------¬o----------¬');
});

i++

it(i + '. ' + 'renders correctly - 6/8 [q-----]', () => {

    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q, type: NotationType.note, ties: [] },
        [q]: { tick: q, keys: ['b'], duration: q * 5, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬r----¬r----¬r----------------¬');
});

i++

it(i + '. ' + 'renders correctly - 6/8 [c--c]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 2, type: NotationType.note, ties: [] },
        [q * 2]: { tick: q * 2, keys: ['b'], duration: q * 2, type: NotationType.rest, ties: [] },
        [q * 4]: { tick: q * 4, keys: ['c'], duration: q * 2, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------¬r----¬r----¬o----------¬');
});

i++

it(i + '. ' + 'renders correctly - 6/8 [-----q]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 5, type: NotationType.rest, ties: [] },
        [q * 5]: { tick: q * 5, keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------¬r----¬r----¬o----¬');
});

i++

it(i + '. ' + 'renders correctly - 12/8 [q-----------]', () => {
    const q = 6;
    const len = q * 12;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { tick: q * 1, keys: ['b'], duration: q * 11, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬r----¬r----¬r----------------¬r----------------------------------¬');
});

i++

it(i + '. ' + 'renders correctly - 12/8 [q----------q]', () => {
    const q = 6;
    const len = q * 12;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { tick: q * 1, keys: ['b'], duration: q * 10, type: NotationType.rest, ties: [] },
        [q * 11]: { tick: q * 11, keys: ['c'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬r----¬r----¬r----------------¬r----------------¬r----¬r----¬o----¬');
});

i++

it(i + '. ' + 'renders correctly - 12/8 [-----------q]', () => {
    const q = 6;
    const len = q * 12;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 11, type: NotationType.rest, ties: [] },
        [q * 11]: { tick: q * 11, keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------¬r----------------¬r----¬r----¬o----¬');
});

i++

it(i + '. ' + 'renders correctly - 3/4 [c--]', () => {
    const c = 12;
    const len = c * 3;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: c * 1, type: NotationType.note, ties: [] },
        [c * 1]: { tick: c * 1, keys: ['b'], duration: c * 2, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------¬r----------¬r----------¬');
});

i++

it(i + '. ' + 'renders correctly - 3/4 [--c]', () => {
    const c = 12;
    const len = c * 3;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: c * 2, type: NotationType.rest, ties: [] },
        [c * 2]: { tick: c * 2, keys: ['b'], duration: c * 1, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------¬r----------¬o----------¬');
});

i++

it(i + '. ' + 'renders correctly - 9/8 [c.------]', () => {
    const q = 6;
    const len = q * 9;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 3, type: NotationType.note, ties: [] },
        [q * 3]: { tick: q * 3, keys: ['b'], duration: q * 6, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------------¬r----------------¬r----------------¬');
});

i++

it(i + '. ' + 'renders correctly - 9/8 [------c.]', () => {
    const q = 6;
    const len = q * 9;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 6, type: NotationType.rest, ties: [] },
        [q * 6]: { tick: 0 * 6, keys: ['b'], duration: q * 3, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------¬r----------------¬o----------------¬');
});

i++

it(i + '. ' + 'renders correctly - 2/4 [----s]', () => {
    const q = 6;
    const sq = 3;
    const len = q * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: (q * 3) + sq, type: NotationType.rest, ties: [] },
        [(q * 3) + sq]: { tick: (q * 3) + sq, keys: ['b'], duration: sq, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------¬r-------¬o-¬');
});

i++;

it(i + '. ' + 'renders correctly - 6/8 [c_ss---]', () => {
    const q = 6;
    const sq = 3;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: sq * 5, type: NotationType.note, ties: [] },
        [sq * 5]: { tick: sq * 4, keys: ['b'], duration: sq, type: NotationType.note, ties: [] },
        [sq * 6]: { tick: sq * 5, keys: ['c'], duration: q * 3, type: NotationType.rest, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o___________o-¬o-¬r----------------¬');
});

i++;

it(i + '. ' + 'renders correctly - 2/4 [qcq]', () => {
    const q = 6;
    const len = q * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q, type: NotationType.note, ties: [] },
        [q]: { tick: q, keys: ['b'], duration: q * 2, type: NotationType.note, ties: [] },
        [q * 3]: { tick: q * 3, keys: ['b'], duration: q, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o----------¬o----¬');
});

i++;

it(i + '. ' + 'renders correctly - 2/4 [sq._c]', () => {
    const q = 6;
    const sq = 3;
    const len = q * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: sq, type: NotationType.note, ties: [] },
        [sq]: { tick: sq, keys: ['b'], duration: sq * 7, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o-¬o________o----------¬');
});

i++;

it(i + '. ' + 'renders correctly - 3/4 [m_qq]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 5, type: NotationType.note, ties: [] },
        [q * 5]: { tick: q, keys: ['a'], duration: q, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o_______________________o----¬o----¬');
});

i++;

it(i + '. ' + 'renders correctly - 3/4 [qq_c.q]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q, type: NotationType.note, ties: [] },
        [q]: { tick: q, keys: ['a'], duration: q * 4, type: NotationType.note, ties: [] },
        [q * 5]: { tick: q * 5, keys: ['b'], duration: q, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o_____o----------------¬o----¬');
});

i++;

it(i + '. ' + 'renders correctly - 3/4 [c.q_c]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 3, type: NotationType.note, ties: [] },
        [q * 3]: { tick: q * 3, keys: ['b'], duration: q * 3, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------------¬o_____o----------¬');
});

i++

it(i + '. ' + 'renders correctly - 3/4 [qq_m]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { tick: q * 1, keys: ['b'], duration: q * 5, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o_____o----------------------¬');
});

i++

it(i + '. ' + 'renders correctly - 6/8 [qq_m]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { tick: q * 1, keys: ['b'], duration: q * 5, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o___________o----------------¬');
});

i++

it(i + '. ' + 'renders correctly - 9/8 [m._cq]', () => {
    const q = 6;
    const len = q * 9;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 8, type: NotationType.note, ties: [] },
        [q * 8]: { tick: q * 8, keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o___________________________________o----------¬o----¬');
});

i++

it(i + '. ' + 'renders correctly - 4/4 [cm.]', () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: c, type: NotationType.note, ties: [] },
        [c]: { tick: c, keys: ['b'], duration: c * 3, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------¬o----------------------------------¬');
});

i++;

it(i + '. ' + 'renders correctly - 4/4 [sq._c_m]', () => {
    const q = 6;
    const sq = 3;
    const len = q * 8;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: sq, type: NotationType.note, ties: [] },
        [sq]: { tick: sq, keys: ['b'], duration: sq * 15, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o-¬o________o___________o----------------------¬');
});

i++;

it(i + '. ' + 'renders correctly - 4/4 [qc._qcq]', () => {
    const q = 6;
    const len = q * 8;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { tick: q * 1, keys: ['b'], duration: q * 4, type: NotationType.note, ties: [] },
        [q * 5]: { tick: q * 5, keys: ['b'], duration: q * 2, type: NotationType.note, ties: [] },
        [q * 7]: { tick: q * 7, keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o_________________o----¬o----------¬o----¬');
});

i++

it(i + '. ' + 'renders correctly - 4/4 [qqqq_c.q]', () => {
    const q = 6;
    const len = q * 8;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { tick: 0, keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { tick: q * 1, keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 2]: { tick: q * 2, keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 3]: { tick: q * 3, keys: ['b'], duration: q * 4, type: NotationType.note, ties: [] },
        [q * 7]: { tick: q * 7, keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const barlines = getFirstBeats(len, flow);
    const output = splitAsPerMeter(len, flow, track, barlines);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o----¬o----¬o_____o----------------¬o----¬');
});

i++;