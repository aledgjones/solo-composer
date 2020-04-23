import React, { FC, useCallback, PointerEvent, useMemo, useRef } from "react";

import { merge } from "solo-ui";

import { TabState, Tool } from "../../../services/ui";
import { useAppState, useAppActions } from "../../../services/state";
import { FlowKey } from "../../../services/flow";
import { Instrument } from "../../../services/instrument";
import { Staves } from "../../../services/stave";
import { Tracks } from "../../../services/track";
import { getToneDimensions, SLOT_HEIGHT } from "./get-tone-dimension";
import { toMidiPitchNumber, Pitch } from "../../../playback/utils";
import { EntryType, Entry } from "../../../entries";
import { Tone } from "../../../entries/tone";
import { trackBackground } from "./track-background";
import { Tick } from "../ticks/defs";
import { ToneElement } from "../tone";
import { getTickFromXPosition, getPitchFromYPosition } from "./pointer-to-track-coords";
import { Direction } from "../../../parse/get-stem-direction";
import { usePatches } from "../../../playback/use-channel";
import { Expressions } from "../../../playback/expressions";

import pencil from "../../../assets/pencil.svg";
import eraser from "../../../assets/eraser.svg";

import "./styles.css";

interface Props {
    flowKey: FlowKey;
    color: string;
    instrument: Instrument;
    staves: Staves;
    tracks: Tracks;
    ticks: Tick[];
}

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

export const InstrumentTrack: FC<Props> = ({ color, instrument, staves, tracks, ticks, flowKey, }) => {

    const channel = usePatches(instrument.key);
    const { tool, selection, audition } = useAppState((s) => {
        return {
            tool: s.ui.tool[TabState.play],
            selection: s.ui.selection,
            audition: s.playback.settings.audition
        };
    });
    const actions = useAppActions();

    const snap = 3; // this need to be generated based on the subdevisions (3/12 === semi-quaver)
    const highestPitch = toMidiPitchNumber("E5");
    const track = useRef<HTMLDivElement>(null);
    const staveKey = instrument.staves[0];
    const trackKey = staves[staveKey].tracks[0];

    const onPlay = useCallback((pitch: Pitch) => {
        if (channel && audition) {
            channel[Expressions.natural].play(pitch, .8, .5)
        }
    }, [channel, audition]);

    const onEdit = useCallback((e: PointerEvent, tone: Entry<Tone>, fixedStart: boolean, fixedDuration: boolean, fixedPitch: boolean) => {
        if (track.current) {

            const box = track.current.getBoundingClientRect();
            const initX = getTickFromXPosition(e.clientX - box.left, ticks, snap, Direction.none);
            let currentPitch = tone.pitch;

            const move = (e: any) => {
                const x = e.clientX - box.left;
                const y = e.clientY - box.top;
                const pitch = fixedPitch ? tone.pitch : getPitchFromYPosition(y, highestPitch, SLOT_HEIGHT);
                const start = getStart(x, ticks, snap, tone, initX, fixedStart, fixedDuration);
                const duration = getDuration(x, ticks, snap, tone, start, fixedStart, fixedDuration);
                if(pitch !== currentPitch) {
                    currentPitch = pitch;
                    onPlay(pitch);
                }
                actions.score.instruments.updateTone(flowKey, trackKey, tone._key, { pitch, duration }, start);
            };

            const end = (e: any) => {
                const x = e.clientX - box.left;
                const start = getStart(x, ticks, snap, tone, initX, fixedStart, fixedDuration);
                const duration = getDuration(x, ticks, snap, tone, start, fixedStart, fixedDuration);
                if (duration <= 0) {
                    actions.score.instruments.removeTone(flowKey, trackKey, tone._key);
                }
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", end);
            };

            window.addEventListener("pointermove", move, { passive: true });
            window.addEventListener("pointerup", end, { passive: true });
            
        }
    }, [track, trackKey, ticks, flowKey, highestPitch, onPlay, actions.score.instruments]);


    const onCreate = useCallback((e: PointerEvent) => {
        if (track.current) {

            const box = track.current.getBoundingClientRect();
            const x = e.clientX - box.left;
            const y = e.clientY - box.top;
            const start = getTickFromXPosition(x, ticks, snap, Direction.down);
            const duration = getTickFromXPosition(x, ticks, snap, Direction.none) - start;
            const pitch = getPitchFromYPosition(y, highestPitch, SLOT_HEIGHT);
            const tone = actions.score.instruments.createTone(flowKey, trackKey, { pitch, duration }, start);

            actions.ui.selection[TabState.play].clear();
            actions.ui.selection[TabState.play].toggle(tone._key);

            onEdit(e, tone, true, false, true);
            onPlay(pitch);

        }
    }, [onEdit, track, trackKey, ticks, flowKey, onPlay, highestPitch, actions.score.instruments, actions.ui.selection]);

    const tones = useMemo(() => {
        const output: Array<{ tone: Entry<Tone>, trackKey: string, top: number, left: number, width: number }> = [];
        instrument.staves.forEach((staveKey) => {
            const stave = staves[staveKey];
            stave.tracks.forEach((trackKey) => {
                const track = tracks[trackKey];
                track.entries.order.forEach((entryKey) => {
                    if (track.entries.byKey[entryKey]._type === EntryType.tone) {
                        const entry = track.entries.byKey[entryKey] as Entry<Tone>;
                        const [top, left, width] = getToneDimensions(highestPitch, entry, ticks);
                        output.push({ tone: entry, trackKey, top, left, width, });
                    }
                });
            });
        });
        return output;
    }, [highestPitch, instrument.staves, staves, ticks, tracks]);

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
            style={{ backgroundImage: trackBackground, cursor }}
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
