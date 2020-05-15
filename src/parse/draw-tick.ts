import { drawClef } from "../entries/clef";
import { Clef } from "../entries/clef-defs";
import { drawKeySignature, KeySignature } from "../entries/key-signature";
import { drawTimeSignature, TimeSignature } from "../entries/time-signature";
import { EntryType, Entry } from "../entries";
import { Stave } from "../services/stave";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { EntriesByTick, entriesByTick } from "../services/track";
import { getEntriesAtTick } from "./get-entry-at-tick";
import { Barline, createBarline, BarlineType, drawBarline } from "../entries/barline";
import { getNearestEntriesToTick } from "./get-nearest-entry-to-tick";
import { sumWidthUpTo, WidthOf } from "./sum-width-up-to";
import { getNotationBaseDuration, getIsDotted, NotationTracks, NotationBaseDuration } from "./notation-track";
import { drawRest } from "./draw-rest";
import { drawNotehead } from "./draw-notehead";
import { drawAbsoluteTempo, AbsoluteTempo } from "../entries/absolute-tempo";
import { EngravingConfig } from "../services/engraving";
import { getStemDirection, stepsFromTop, Direction } from "./get-stem-direction";
import { drawNoteStem } from "./draw-note-stem";
import { getIsRest } from "./is-rest";
import { getShuntedNoteheads } from "./get-shunted-noteheads";
import { drawLedgerLines } from "./draw-ledger-lines";
import { Tone } from "../entries/tone";
import { getTieDirection } from "./get-tie-direction";
import { sumTickWidths } from "./sum-tick-widths";
import { getTicksPerBeat } from "./get-ticks-per-beat";
import { getIsEmpty } from "./get-is-empty";
import { drawDots } from "./draw-dots";
import { drawTie } from "./draw-tie";
import { glyphFromDuration } from "./get-glyph-from-duration";
import { getNoteheadWidthFromDuration } from "./get-notehead-width-from-duration";

export interface ToneDetails {
    tone: Entry<Tone>;
    offset: number;
    isShunt: boolean;
    tie: Direction;
}

export function drawTick(
    tick: number,
    isFirstBeat: boolean,
    systemX: number,
    y: number,
    horizontalMeasurements: number[][],
    verticalMeasurements: VerticalMeasurements,
    flowEntries: EntriesByTick,
    staves: Stave[],
    notationTracks: NotationTracks,
    config: EngravingConfig
) {
    const output = [];

    let x = systemX + sumTickWidths(0, tick, horizontalMeasurements);

    const widths = horizontalMeasurements[tick];

    const keyResult = getNearestEntriesToTick<KeySignature>(tick, flowEntries, EntryType.keySignature);
    const key = keyResult.entries[0];
    const timeResult = getNearestEntriesToTick<TimeSignature>(tick, flowEntries, EntryType.timeSignature);
    const time = timeResult.entries[0];
    const barline = getEntriesAtTick<Barline>(tick, flowEntries, EntryType.barline).entries[0];
    const tempo = getEntriesAtTick<AbsoluteTempo>(tick, flowEntries, EntryType.absoluteTempo).entries[0];

    const ticksInBar = getTicksPerBeat(time.subdivisions, time.beatType) * time.beats;

    if (barline) {
        if (barline.type === BarlineType.start_repeat) {
            output.push(
                ...drawBarline(x + sumWidthUpTo(widths, WidthOf.startRepeat), y, staves, verticalMeasurements, barline)
            );
        } else if (barline.type === BarlineType.end_repeat) {
            output.push(
                ...drawBarline(x + sumWidthUpTo(widths, WidthOf.endRepeat), y, staves, verticalMeasurements, barline)
            );
        } else {
            output.push(
                ...drawBarline(x + sumWidthUpTo(widths, WidthOf.barline), y, staves, verticalMeasurements, barline)
            );
        }
    } else if (tick !== 0) {
        if ((key && keyResult.at === tick) || (time && timeResult.at === tick)) {
            const normalBarline = createBarline({ type: BarlineType.double }, 0);
            output.push(
                ...drawBarline(
                    x + sumWidthUpTo(widths, WidthOf.barline),
                    y,
                    staves,
                    verticalMeasurements,
                    normalBarline
                )
            );
        } else if (isFirstBeat) {
            const normalBarline = createBarline({ type: BarlineType.normal }, 0);
            output.push(
                ...drawBarline(
                    x + sumWidthUpTo(widths, WidthOf.barline),
                    y,
                    staves,
                    verticalMeasurements,
                    normalBarline
                )
            );
        }
    }

    if (tempo) {
        output.push(drawAbsoluteTempo(x + sumWidthUpTo(widths, WidthOf.time), y, tempo, config));
    }

    staves.forEach((stave) => {
        const staveEntries = entriesByTick(stave.master.entries.order, stave.master.entries.byKey);
        const clefResult = getNearestEntriesToTick<Clef>(tick, staveEntries, EntryType.clef);
        const clef = clefResult.entries[0];

        const top = y + verticalMeasurements.staves[stave.key].y;

        if (clef && clefResult.at === tick) {
            output.push(drawClef(x + sumWidthUpTo(widths, WidthOf.clef), top, clef));
        }

        if (clef && key && keyResult.at === tick) {
            output.push(...drawKeySignature(x + sumWidthUpTo(widths, WidthOf.key), top, clef, key, stave.key));
        }

        if (time && timeResult.at === tick) {
            output.push(...drawTimeSignature(x + sumWidthUpTo(widths, WidthOf.time), top, time, stave.key));
        }

        stave.tracks.forEach((trackKey) => {
            const track = notationTracks[trackKey];

            if (track[tick]) {
                const entry = track[tick];

                if (getIsRest(entry)) {
                    const isBarEmpty = isFirstBeat && getIsEmpty(tick, tick + ticksInBar, track);
                    const duration = isBarEmpty
                        ? NotationBaseDuration.semibreve
                        : getNotationBaseDuration(entry.duration, time.subdivisions);
                    const isDotted = isBarEmpty ? false : getIsDotted(entry.duration, time.subdivisions);
                    const barWidth = sumTickWidths(tick, tick + ticksInBar, horizontalMeasurements);
                    const preWidth = sumWidthUpTo(widths, WidthOf.noteSpacing);

                    output.push(
                        ...drawRest(
                            x,
                            top,
                            duration,
                            barWidth,
                            preWidth,
                            isBarEmpty,
                            isDotted,
                            `${trackKey}-${tick}-rest`
                        )
                    );
                } else {
                    const duration = getNotationBaseDuration(entry.duration, time.subdivisions);
                    const glyph = glyphFromDuration(duration);
                    const glyphWidth = getNoteheadWidthFromDuration(duration);
                    const isDotted = getIsDotted(entry.duration, time.subdivisions);
                    const tieWidth =
                        sumTickWidths(tick, tick + entry.duration, horizontalMeasurements) -
                        sumWidthUpTo(widths, WidthOf.preNoteSlot) +
                        sumWidthUpTo(horizontalMeasurements[tick + entry.duration], WidthOf.preNoteSlot);
                    const stemDirection = getStemDirection(entry.tones, clef);
                    const [hasShunts, shuntedNoteheads] = getShuntedNoteheads(entry.tones, stemDirection);
                    const details: ToneDetails[] = entry.tones.map((tone, i) => {
                        return {
                            tone,
                            offset: stepsFromTop(tone, clef),
                            isShunt: shuntedNoteheads[tone._key],
                            tie: !entry.ties.includes(tone._key)
                                ? Direction.none
                                : getTieDirection(entry.tones.length, i, stemDirection)
                        };
                    });

                    details.forEach((detail) => {
                        output.push(
                            ...drawNotehead(
                                x + sumWidthUpTo(widths, WidthOf.noteSpacing),
                                top,
                                detail,
                                glyph,
                                glyphWidth,
                                stemDirection,
                                `${detail.tone._key}-${tick}-notehead`
                            ),
                            ...drawTie(
                                x + sumWidthUpTo(widths, WidthOf.noteSpacing),
                                top,
                                detail,
                                glyphWidth,
                                entry.tones.length > 1,
                                tieWidth,
                                hasShunts,
                                `${detail.tone._key}-${tick}-tie`
                            )
                        );
                    });

                    // only draw stems if the note is less tahn a semi-breve in length
                    if (duration && duration < NotationBaseDuration.semibreve) {
                        output.push(
                            drawNoteStem(
                                x + sumWidthUpTo(widths, WidthOf.noteSpacing),
                                top,
                                details,
                                stemDirection,
                                `${trackKey}-${tick}-stem`
                            )
                        );
                    }

                    output.push(
                        ...drawLedgerLines(
                            x + sumWidthUpTo(widths, WidthOf.noteSpacing),
                            top,
                            details,
                            duration,
                            stemDirection,
                            `${trackKey}-${tick}-ledger-line`
                        )
                    );

                    if (isDotted) {
                        output.push(
                            ...drawDots(
                                x + sumWidthUpTo(widths, WidthOf.noteSpacing),
                                top,
                                details,
                                duration,
                                stemDirection,
                                hasShunts,
                                `${trackKey}-${tick}-dots`
                            )
                        );
                    }
                }
            }
        });
    });

    return output;
}
