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
import { getNotationBaseLength, getIsDotted, NotationTracks } from "./notation-track";
import { drawRest } from "./draw-rest";
import { drawNotehead } from "./draw-note";
import { drawAbsoluteTempo, AbsoluteTempo } from "../entries/absolute-tempo";
import { EngravingConfig } from "../services/engraving";
import { getStemDirection, stepsFromTop } from "./get-stem-direction";
import { drawNoteStem } from "./draw-note-stem";

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

            if (notationTrack[tick]) {
                const entry = notationTrack[tick];
                const length = getNotationBaseLength(entry.duration, subdivisions);
                const isDotted = getIsDotted(entry.duration, subdivisions);

                if (entry.tones.length === 0) {
                    output.push(...drawRest(x + widthUpTo(widths, WidthOf.noteSpacing), top, length, isDotted));
                } else {

                    const stemDirection = getStemDirection(entry.tones, clef);
                    output.push(drawNoteStem(x + widthUpTo(widths, WidthOf.noteSpacing), top, entry.tones, clef, stemDirection));
                    entry.tones.forEach(tone => {
                        const offset = stepsFromTop(tone, clef) / 2;
                        output.push(...drawNotehead(x + widthUpTo(widths, WidthOf.noteSpacing), top, offset, length, isDotted));
                    });

                }
            }

        })

    });

    return output;
}