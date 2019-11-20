import shortid from "shortid";

import { EntriesByTick } from "../services/track";
import { EntryKey, Entry, EntryType } from "../entries";
import { Tone } from "../entries/tone";
import { RhythmTrack, Rhythm, DurationType } from "./rhythm-track";

/**
 *  split tones into notated rhythms (none timesignature based)
 * 
 *  we split notation on the on / off of new notes while other, longer notes are playing
 */
export function notateTones(length: number, track: EntriesByTick) {

    const rhythmTrack: RhythmTrack = {};

    let previousEvent: Rhythm | null = null;
    const offsByTick: { [tick: number]: EntryKey[] } = {};

    // walk through each tick - by definition something could happen on any tick
    for (let tick = 0; tick <= length; tick++) {

        const trackEntries = track[tick] || [];
        const offEntries = offsByTick[tick] || [];

        const currentEvent: Rhythm = { keys: [], duration: 0, type: DurationType.note, ties: [] };

        // we spilt the ongoing notes at: note off, new note or firstbeat; 
        if (previousEvent && (offEntries.length > 0 || trackEntries.length > 0)) {
            // we dont hold rests or tones that are 'off on this tick
            const holds = previousEvent.keys.filter(key => {
                return (previousEvent && previousEvent.type !== DurationType.rest) && !offEntries.includes(key)
            });
            currentEvent.keys = [...holds];
            previousEvent.ties.push(...holds);
            delete offsByTick[tick];
        }

        // any new notes added
        trackEntries.forEach(entry => {
            if (entry._type === EntryType.tone) {
                const tone = entry as Entry<Tone>;
                currentEvent.keys.push(tone._key);

                const off = tick + tone.duration;
                if (offsByTick[off]) {
                    offsByTick[off].push(tone._key);
                } else {
                    offsByTick[off] = [tone._key];
                }
            }
        });

        const isRest = Object.keys(offsByTick).length === 0;
        if (isRest) {
            if (!previousEvent || previousEvent.type !== DurationType.rest) {
                currentEvent.keys.push(shortid());
                currentEvent.type = DurationType.rest;;
            }
        }

        if (previousEvent) {
            previousEvent.duration++;
        }

        // if there are no entries, nothing happened at this tick
        if (currentEvent.keys.length > 0) {
            rhythmTrack[tick] = currentEvent;
            previousEvent = currentEvent;
        }

    }

    // console.log(rhythmTrack);

    return rhythmTrack;
}