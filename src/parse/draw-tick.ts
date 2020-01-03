import { drawClef } from "../entries/clef";
import { Clef } from "../entries/clef-defs";
import { drawKeySignature, KeySignature } from "../entries/key-signature";
import { drawTimeSignature, TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { Stave } from "../services/stave";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { EntriesByTick, entriesByTick } from "../services/track";
import { getEntryAtTick } from "./get-entry-at-tick";
import { Barline, createBarline, BarlineType, drawBarline } from "../entries/barline";
import { getNearestEntryToTick } from "./get-nearest-entry-to-tick";
import { widthUpTo, WidthOf } from "./measure-tick";
import { getNotationBaseLength, getIsDotted, NotationType, NotationTracks } from "./notation-track";
import { drawRest } from "./draw-rest";
import { getStepsBetweenPitces } from "./get-steps-between-pitches";
import { drawNote } from "./draw-note";
import { Tone } from "../entries/tone";
import { drawAbsoluteTempo, AbsoluteTempo } from "../entries/absolute-tempo";
import { EngravingConfig } from "../services/engraving";
import { Converter } from "./converter";

export function drawTick(tick: number, isFirstBeat: boolean, x: number, y: number, widths: number[], verticalMeasurements: VerticalMeasurements, flowEntries: EntriesByTick, staves: Stave[], notationTracks: NotationTracks, config: EngravingConfig, converter: Converter) {
    const output = [];

    const key = getNearestEntryToTick<KeySignature>(tick, flowEntries, EntryType.keySignature);
    const time = getNearestEntryToTick<TimeSignature>(tick, flowEntries, EntryType.timeSignature);
    const barline = getEntryAtTick<Barline>(tick, flowEntries, EntryType.barline);
    const tempo = getEntryAtTick<AbsoluteTempo>(tick, flowEntries, EntryType.absoluteTempo);

    const subdivisions = time.entry ? time.entry.subdivisions : 12;

    if (barline.entry) {
        if (barline.entry.type === BarlineType.start_repeat) {
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.startRepeat), y, staves, verticalMeasurements, barline.entry));
        } else if (barline.entry.type === BarlineType.end_repeat) {
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.endRepeat), y, staves, verticalMeasurements, barline.entry));
        } else {
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.barline), y, staves, verticalMeasurements, barline.entry));
        }
    } else if (tick !== 0) {
        if ((key.entry && key.at === tick) || (time.entry && time.at === tick)) {
            const normalBarline = createBarline({ type: BarlineType.double }, 0);
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.barline), y, staves, verticalMeasurements, normalBarline));
        } else if (isFirstBeat) {
            const normalBarline = createBarline({ type: BarlineType.normal }, 0);
            output.push(...drawBarline(x + widthUpTo(widths, WidthOf.barline), y, staves, verticalMeasurements, normalBarline));
        }
    }

    if(tempo.entry) {
        output.push(...drawAbsoluteTempo(x + widthUpTo(widths, WidthOf.time), y, tempo.entry, config, converter))
    }

    staves.forEach(stave => {

        const staveEntries = entriesByTick(stave.master.entries.order, stave.master.entries.byKey);
        const clef = getNearestEntryToTick<Clef>(tick, staveEntries, EntryType.clef);

        const clefPitch = clef.entry ? clef.entry.type : 'G4';
        const clefOffset = clef.entry ? clef.entry.offset : 3;

        const top = y + verticalMeasurements.staves[stave.key].y;

        if (clef.entry && clef.at === tick) {
            output.push(drawClef(x + widthUpTo(widths, WidthOf.clef), top, clef.entry));
        }

        if (clef.entry && (key.entry && key.at === tick)) {
            output.push(...drawKeySignature(x + widthUpTo(widths, WidthOf.key), top, clef.entry, key.entry));
        }

        if (time.entry && time.at === tick) {
            output.push(...drawTimeSignature(x + widthUpTo(widths, WidthOf.time), top, time.entry));
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
                        const toneOffset = getStepsBetweenPitces(clefPitch, tone.pitch);
                        const offset = (clefOffset / 2) - (toneOffset / 2);
                        output.push(...drawNote(x + widthUpTo(widths, WidthOf.noteSpacing), top, offset, length, isDotted));
                    });
                }
            }

        })

    });

    return output;
}