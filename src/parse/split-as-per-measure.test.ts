import { splitAsPerMeter } from "./split-as-per-meter";
import { createTimeSignature } from "../entries/time-signature";
import { getDefaultGroupings } from "./get-default-groupings";
import { NotationTrack, NotationType } from "./notation-track";
import { EntriesByTick } from "../services/track";
import { debugTrack } from "../debug/debug-track";

it('splits notes at barlines only', () => {
    const len = 12 * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { keys: ['a'], duration: len, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o_______________________o----------------------¬');
});

it('splits rests at barlines only', () => {
    const len = 12 * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------¬r----------------------¬');
});

it('renders a full bar rest as such - 2/4', () => {
    const len = 12 * 2;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------¬');
});

it('renders a full bar rest as such - 3/4', () => {
    const len = 12 * 3;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------¬');
});

it('renders a full bar rest as such - 6/8', () => {
    const len = 12 * 3;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------¬');
});

it('renders a full bar rest as such - 4/4', () => {
    const len = 12 * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { keys: ['a'], duration: len, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------------------¬');
});

it('renders correctly - 4/4 [c---]', () => {
    const q = 12;
    const len = q * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [0]: { keys: ['a'], duration: 12, type: NotationType.note, ties: [] },
        [12]: { keys: ['b'], duration: q * 3, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------¬r----------¬r----------------------¬');
});

it('renders correctly - 4/4 [c--c]', () => {
    const q = 12;
    const len = q * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { keys: ['b'], duration: q * 2, type: NotationType.rest, ties: [] },
        [q * 3]: { keys: ['c'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------¬r----------¬r----------¬o----------¬');
});

it('renders correctly - 4/4 [---c]', () => {
    const q = 12;
    const len = q * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 3, type: NotationType.rest, ties: [] },
        [q * 3]: { keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------¬r----------¬o----------¬');
});

it('renders correctly - 6/8 [q-----]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { keys: ['b'], duration: q * 5, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬r----¬r----¬r----------------¬');
});

it('renders correctly - 6/8 [c--c]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 2, type: NotationType.note, ties: [] },
        [q * 2]: { keys: ['b'], duration: q * 2, type: NotationType.rest, ties: [] },
        [q * 4]: { keys: ['c'], duration: q * 2, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------¬r----¬r----¬o----------¬');
});

it('renders correctly - 6/8 [-----q]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 5, type: NotationType.rest, ties: [] },
        [q * 5]: { keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------¬r----¬r----¬o----¬');
});

it('renders correctly - 12/8 [q-----------]', () => {
    const q = 6;
    const len = q * 12;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { keys: ['b'], duration: q * 11, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬r----¬r----¬r----------------¬r----------------------------------¬');
});

it('renders correctly - 12/8 [q----------q]', () => {
    const q = 6;
    const len = q * 12;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { keys: ['b'], duration: q * 10, type: NotationType.rest, ties: [] },
        [q * 11]: { keys: ['c'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬r----¬r----¬r----------------¬r----------------¬r----¬r----¬o----¬');
});

it('renders correctly - 12/8 [-----------q]', () => {
    const q = 6;
    const len = q * 12;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 11, type: NotationType.rest, ties: [] },
        [q * 11]: { keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------------------------¬r----------------¬r----¬r----¬o----¬');
});

it('renders correctly - 3/4 [c--]', () => {
    const q = 12;
    const len = q * 3;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { keys: ['b'], duration: q * 2, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------¬r----------¬r----------¬');
});

it('renders correctly - 3/4 [--c]', () => {
    const q = 12;
    const len = q * 3;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 2, type: NotationType.rest, ties: [] },
        [q * 2]: { keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------¬r----------¬o----------¬');
});

it('renders correctly - 9/8 [c.------]', () => {
    const q = 6;
    const len = q * 9;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 3, type: NotationType.note, ties: [] },
        [q * 3]: { keys: ['b'], duration: q * 6, type: NotationType.rest, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------------¬r----------------¬r----------------¬');
});

it('renders correctly - 9/8 [------c.]', () => {
    const q = 6;
    const len = q * 9;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 6, type: NotationType.rest, ties: [] },
        [q * 6]: { keys: ['b'], duration: q * 3, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------------¬r----------------¬o----------------¬');
});

it('renders correctly - 2/4 [----s]', () => {
    const q = 6;
    const sq = 3;
    const len = q * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: (q * 3) + sq, type: NotationType.rest, ties: [] },
        [(q * 3) + sq]: { keys: ['b'], duration: sq, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('r----------¬r-------¬o-¬');
});

// FROM HERE














it('renders correctly - 3/4 [c.q_c]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 3, type: NotationType.note, ties: [] },
        [q * 3]: { keys: ['b'], duration: q * 3, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----------------¬o_____o----------¬');
});

it('renders correctly - 3/4 [qq_c.q]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { keys: ['b'], duration: q * 4, type: NotationType.note, ties: [] },
        [q * 5]: { keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o_____o----------------¬o----¬');
});

it('renders correctly - 3/4 [qq_m]', () => {
    const q = 6;
    const len = q * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { keys: ['b'], duration: q * 5, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o_____o----------------------¬');
});

it('renders correctly - 9/8 [m._cq]', () => {
    const q = 6;
    const len = q * 9;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 8, type: NotationType.note, ties: [] },
        [q * 8]: { keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o___________________________________o----------¬o----¬');
});

it('renders correctly - 4/4 [qc._qcq]', () => {
    const q = 6;
    const len = q * 8;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { keys: ['b'], duration: q * 4, type: NotationType.note, ties: [] },
        [q * 5]: { keys: ['b'], duration: q * 2, type: NotationType.note, ties: [] },
        [q * 7]: { keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o_________________o----¬o----------¬o----¬');
});

it('renders correctly - 4/4 [qqqq_c.q]', () => {
    const q = 6;
    const len = q * 8;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 }, 0)]
    }

    const track: NotationTrack = {
        [q * 0]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 1]: { keys: ['a'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 2]: { keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] },
        [q * 3]: { keys: ['b'], duration: q * 4, type: NotationType.note, ties: [] },
        [q * 7]: { keys: ['b'], duration: q * 1, type: NotationType.note, ties: [] }
    }

    const output = splitAsPerMeter(flow, track);
    const log = debugTrack(len, output);

    expect(log).toBe('o----¬o----¬o----¬o_____o----------------¬o----¬');
});