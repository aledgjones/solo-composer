import React, { FC, useCallback, PointerEvent, useMemo, useRef } from "react";

import { merge } from "solo-ui";

import { TabState, Tool } from "../../../services/ui";
import { useAppState, useAppActions } from "../../../services/state";
import { FlowKey } from "../../../services/flow";
import { Instrument } from "../../../services/instrument";
import { Staves } from "../../../services/stave";
import { Tracks } from "../../../services/track";
import { getToneDimensions, SLOT_HEIGHT, BASE_TONE } from "./get-tone-dimension";
import { Pitch } from "../../../playback/utils";
import { EntryType, Entry } from "../../../entries";
import { Tone } from "../../../entries/tone";
import { trackBackground } from "./track-background";
import { Tick } from "../ticks/defs";
import { ToneElement } from "../tone";
import { getTickFromXPosition, getPitchFromYPosition } from "./pointer-to-track-coords";
import { Direction } from "../../../parse/get-stem-direction";
import { usePatches } from "../../../playback/use-channel";
import { Expressions } from "../../../playback/expressions";
import { dragHandler } from "../../../components/drag-handler";

import pencil from "../../../assets/cursors/pencil.svg";
import eraser from "../../../assets/cursors/eraser.svg";

import "./styles.css";

function getDuration(x: number, ticks: Tick[], snap: number, tone: Entry<Tone>, start: number, fixedStart: boolean, fixedDuration: boolean) {
    if (fixedDuration) {
        return tone.duration;
    } else {

        const duration = fixedStart ? getTickFromXPosition(x, ticks, snap, Direction.none) - start : tone.duration - (start - tone._tick);

        if (duration < 0) {
            return 0;
        } else if (start + duration > ticks.length) {
            return ticks.length - start - 1;
        } else {
            return duration;
        }
    }
}

function getStart(x: number, ticks: Tick[], snap: number, tone: Entry<Tone>, initX: number, fixedStart: boolean, fixedDuration: boolean) {
    if (fixedStart) {
        return tone._tick;
    } else {
        if (fixedDuration) {
            const start = tone._tick + (getTickFromXPosition(x, ticks, snap, Direction.none) - initX);
            if (start < 0) {
                return 0;
            } else if (start + tone.duration > ticks.length) {
                // avoid overshooting the track
                return ticks.length - 1 - tone.duration;
            } else {
                return start;
            }
        } else {
            const max = tone._tick + tone.duration;
            const start = tone._tick + (getTickFromXPosition(x, ticks, snap, Direction.none) - initX);
            return start < max ? start : max;
        }
    }
}

interface Props {
    flowKey: FlowKey;
    color: string;
    instrument: Instrument;
    staves: Staves;
    tracks: Tracks;
    ticks: Tick[];
}

export const InstrumentTrack: FC<Props> = ({ flowKey, color, instrument, staves, tracks, ticks }) => {

    const channel = usePatches(instrument.key);
    const { tool, selection, audition, offset } = useAppState((s) => {
        return {
            tool: s.ui.tool[TabState.play],
            selection: s.ui.selection,
            audition: s.playback.settings.audition,
            offset: s.ui.pianoRollOffsetY[instrument.key] || 0
        };
    }, [instrument.key]);
    const actions = useAppActions();

    const highestNoteOnPianoRoll = BASE_TONE + offset;
    const snap = 3; // this need to be generated based on the subdevisions (3/12 === semi-quaver)
    const track = useRef<HTMLDivElement>(null);
    const staveKey = instrument.staves[0];
    const trackKey = staves[staveKey].tracks[0];

    const onPlay = useCallback((pitch: Pitch) => {
        if (channel && channel[Expressions.natural] && audition) {
            channel[Expressions.natural].play(pitch, .8, .5)
        }
    }, [channel, audition]);

    const onEdit = useCallback((e: PointerEvent<HTMLElement>, tone: Entry<Tone>, fixedStart: boolean, fixedDuration: boolean, fixedPitch: boolean) => {

        const handler = dragHandler<{ box: DOMRect, x: number, pitch: Pitch }>({
            onDown: ev => {
                if (track.current) {
                    const box = track.current.getBoundingClientRect();
                    return {
                        box,
                        x: getTickFromXPosition(ev.clientX - box.left, ticks, snap, Direction.none),
                        pitch: tone.pitch
                    }
                } else {
                    return false;
                }
            },
            onMove: (ev, init) => {
                const x = ev.clientX - init.box.left;
                const y = ev.clientY - init.box.top;
                const pitch = fixedPitch ? tone.pitch : getPitchFromYPosition(y, highestNoteOnPianoRoll, SLOT_HEIGHT);
                const start = getStart(x, ticks, snap, tone, init.x, fixedStart, fixedDuration);
                const duration = getDuration(x, ticks, snap, tone, start, fixedStart, fixedDuration);
                if (pitch !== init.pitch) {
                    init.pitch = pitch;
                    onPlay(pitch);
                }
                actions.score.instruments.updateTone(flowKey, trackKey, tone._key, { pitch, duration }, start);
            },
            onEnd: (ev, init) => {
                const x = ev.clientX - init.box.left;
                const start = getStart(x, ticks, snap, tone, init.x, fixedStart, fixedDuration);
                const duration = getDuration(x, ticks, snap, tone, start, fixedStart, fixedDuration);
                if (duration <= 0) {
                    actions.score.instruments.removeTone(flowKey, trackKey, tone._key);
                }
            }
        });

        handler(e);

    }, [track, trackKey, ticks, flowKey, highestNoteOnPianoRoll, onPlay, actions.score.instruments]);


    const onCreate = useCallback((e: PointerEvent<HTMLElement>) => {
        if (track.current) {

            const box = track.current.getBoundingClientRect();
            const x = e.clientX - box.left;
            const y = e.clientY - box.top;
            const start = getTickFromXPosition(x, ticks, snap, Direction.down);
            const duration = getTickFromXPosition(x, ticks, snap, Direction.none) - start;
            const pitch = getPitchFromYPosition(y, highestNoteOnPianoRoll, SLOT_HEIGHT);
            const tone = actions.score.instruments.createTone(flowKey, trackKey, { pitch, duration }, start);

            actions.ui.selection[TabState.play].clear();
            actions.ui.selection[TabState.play].select(tone._key);

            onEdit(e, tone, true, false, true);
            onPlay(pitch);

        }
    }, [onEdit, track, trackKey, ticks, flowKey, onPlay, highestNoteOnPianoRoll, actions.score.instruments, actions.ui.selection]);

    const tones = useMemo(() => {
        const output: Array<{ tone: Entry<Tone>, trackKey: string, top: number, left: number, width: number }> = [];
        instrument.staves.forEach((staveKey) => {
            const stave = staves[staveKey];
            stave.tracks.forEach((trackKey) => {
                const track = tracks[trackKey];
                track.entries.order.forEach((entryKey) => {
                    if (track.entries.byKey[entryKey]._type === EntryType.tone) {
                        const entry = track.entries.byKey[entryKey] as Entry<Tone>;
                        const [top, left, width] = getToneDimensions(highestNoteOnPianoRoll, entry, ticks);
                        output.push({ tone: entry, trackKey, top, left, width, });
                    }
                });
            });
        });
        return output;
    }, [highestNoteOnPianoRoll, instrument.staves, staves, ticks, tracks]);

    const cursor = useMemo(() => {
        switch (tool) {
            case Tool.pencil:
                return `url(${pencil}) 4 20, default`;
            case Tool.eraser:
                return `url(${eraser}) 4 20, default`;
            default:
                return "default";
        }
    }, [tool]);

    return (
        <div
            ref={track}
            className={merge("instrument-track", { "no-scroll": tool === Tool.pencil })}
            onPointerDown={tool === Tool.pencil ? onCreate : undefined}
            style={{ backgroundImage: trackBackground, backgroundPositionY: offset * SLOT_HEIGHT, cursor }}
        >
            {tones.map(({ tone, trackKey, top, left, width }) => {
                return (
                    <ToneElement
                        key={tone._key}

                        flowKey={flowKey}
                        trackKey={trackKey}
                        tone={tone}

                        color={color}
                        tool={tool}
                        selected={selection[tone._key]}
                        top={top}
                        left={left}
                        width={width}

                        onEdit={onEdit}
                        onPlay={onPlay}
                    />
                );
            })}
        </div>
    );
};
