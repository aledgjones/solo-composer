import shortid from "shortid";

import { EntriesByTick } from "../services/track";
import { EntryKey, Entry, EntryType } from "../entries";
import { Tone } from "../entries/tone";
import { NotationTrack, Notation } from "./notation-track";
import { getStepsBetweenPitches } from "../playback/utils";

/**
 *  split tones into notated rhythms (none timesignature based)
 * 
 *  we split notation on the on / off of new notes while other, longer notes are playing
 */
export function notateTones(length: number, track: EntriesByTick, rhythmTrack: NotationTrack) {

    let previousEvent: Notation | null = null;
    const offsByTick: { [tick: number]: EntryKey[] } = {};

    // walk through each tick - by definition something could happen on any tick
    for (let tick = 0; tick <= length; tick++) {

        const trackEntries = track[tick] || [];
        const offEntries = offsByTick[tick] || [];

        const currentEvent: Notation = { key: shortid(), tones: [], duration: 0, ties: [] };

        // we spilt the ongoing notes at: note off, new note or firstbeat; 
        if (previousEvent && (offEntries.length > 0 || trackEntries.length > 0)) {
            // we dont hold rests or tones that are 'off on this tick
            const holds = previousEvent.tones.filter(tone => {
                return (previousEvent && previousEvent.tones.length > 0) && !offEntries.includes(tone._key);
            });
            currentEvent.tones = [...holds];
            previousEvent.ties.push(...holds.map(hold => hold._key));
            delete offsByTick[tick];
        }

        // any new notes added
        trackEntries.forEach(entry => {
            if (entry._type === EntryType.tone) {
                const tone = entry as Entry<Tone>;
                currentEvent.tones.push(tone);
                // sort the keys into asc order of pitch
                currentEvent.tones.sort((a, b) => {
                    return getStepsBetweenPitches(b.pitch, a.pitch);
                });
                const off = tick + tone.duration;
                if (offsByTick[off]) {
                    offsByTick[off].push(tone._key);
                } else {
                    offsByTick[off] = [tone._key];
                }
            }
        });

        if (previousEvent) {
            previousEvent.duration++;
        }

        const isRest = Object.keys(offsByTick).length === 0;
        const somethingHappened = !previousEvent || currentEvent.tones.length > 0 || (isRest && previousEvent.tones.length > 0);
        if (somethingHappened) {
            rhythmTrack[tick] = currentEvent;
            previousEvent = currentEvent;
        }

    }

    return rhythmTrack;
}