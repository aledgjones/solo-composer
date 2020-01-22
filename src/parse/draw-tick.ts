import { drawClef } from "../entries/clef";
import { Clef } from "../entries/clef-defs";
import { drawKeySignature, KeySignature } from "../entries/key-signature";
import { drawTimeSignature, TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { Stave } from "../services/stave";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { EntriesByTick, entriesByTick } from "../services/track";
import { getEntriesAtTick } from "./get-entry-at-tick";
import { Barline, createBarline, BarlineType, drawBarline } from "../entries/barline";
import { getNearestEntriesToTick } from "./get-nearest-entry-to-tick";
import { widthUpTo, WidthOf } from "./measure-tick";
import { getNotationBaseLength, getIsDotted, NotationType, NotationTracks } from "./notation-track";
import { drawRest } from "./draw-rest";
import { drawNote } from "./draw-note";
import { Tone } from "../entries/tone";
import { drawAbsoluteTempo, AbsoluteTempo } from "../entries/absolute-tempo";
import { EngravingConfig } from "../services/engraving";
import { Converter } from "./converter";
import { getStepsBetweenPitches } from "../playback/utils";

export function drawTick(tick: number, isFirstBeat: boolean, x: number, y: number, widths: number[], verticalMeasurements: VerticalMeasurements, flowEntries: EntriesByTick, staves: Stave[], notationTracks: NotationTracks, config: EngravingConfig) {
    const output = [];

    const keyResult = getNearestEntriesToTick<KeySignature>(tick, flowEntries, EntryType.keySignature);
    const key = keyResult.entries[0];
    const timeResult = getNearestEntriesToTick<TimeSignature>(tick, flowEntries, EntryType.timeSignature);
    const time = timeResult.entries[0];
    const barline = getEntriesAtTick<Barline>(tick, flowEntries, EntryType.barline)[0];
    const tempo = getEntriesAtTick<AbsoluteTempo>(tick, flowEntries, EntryType.absoluteTempo)[0];

    const subdivisions = time ? time.subdivisions : 12;

    if (barline) {
        if (barline.type === BarlineType.start_repeat) {
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.startRepeat), y, staves, verticalMeasurements, barline));
        } else if (barline.type === BarlineType.end_repeat) {
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.endRepeat), y, staves, verticalMeasurements, barline));
        } else {
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.barline), y, staves, verticalMeasurements, barline));
        }
    } else if (tick !== 0) {
        if ((key && keyResult.at === tick) || (time && timeResult.at === tick)) {
            const normalBarline = createBarline({ type: BarlineType.double }, 0);
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.barline), y, staves, verticalMeasurements, normalBarline));
        } else if (isFirstBeat) {
            const normalBarline = createBarline({ type: BarlineType.normal }, 0);
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.barline), y, staves, verticalMeasurements, normalBarline));
        }
    }

    if (tempo) {
        output.push(drawAbsoluteTempo(x + widthUpTo(widths, WidthOf.time), y, tempo, config))
    }

    staves.forEach(stave => {

        const staveEntries = entriesByTick(stave.master.entries.order, stave.master.entries.byKey);
        const clefResult = getNearestEntriesToTick<Clef>(tick, staveEntries, EntryType.clef);
        const clef = clefResult.entries[0];

        const clefPitch = clef ? clef.type : 'G4';
        const clefOffset = clef ? clef.offset : 3;

        const top = y + verticalMeasurements.staves[stave.key].y;

        if (clef && clefResult.at === tick) {
            output.push(drawClef(x + widthUpTo(widths, WidthOf.clef), top, clef));
        }

        if (clef && (key && keyResult.at === tick)) {
            output.push(...drawKeySignature(x + widthUpTo(widths, WidthOf.key), top, clef, key));
        }

        if (time && timeResult.at === tick) {
            output.push(...drawTimeSignature(x + widthUpTo(widths, WidthOf.time), top, time));
        }

        stave.tracks.order.forEach(trackKey => {

            const notationTrack = notationTracks[trackKey];
            const tones = stave.tracks.byKey[trackKey].entries.byKey;

            if (notationTrack[tick]) {
                const entry = notationTrack[tick];
                const length = getNotationBaseLength(entry.duration, subdivisions);
                const isDotted = getIsDotted(entry.duration, subdivisions);
                if (entry.type === NotationType.rest) {
                    output.push(...drawRest(x + widthUpTo(widths, WidthOf.noteSpacing), top, length, isDotted));
                } else {
                    entry.keys.forEach(key => {
                        const tone = tones[key] as Tone;
                        const toneOffset = getStepsBetweenPitches(clefPitch, tone.pitch);
                        const offset = (clefOffset / 2) - (toneOffset / 2);
                        output.push(...drawNote(x + widthUpTo(widths, WidthOf.noteSpacing), top, offset, length, isDotted));
                    });
                }
            }

        })

    });

    return output;
}