import React, { FC, useCallback, PointerEvent, useState, useMemo, useEffect } from 'react';

import { merge } from 'solo-ui';

import { TabState, Tool } from '../../../services/ui';
import { useAppState, useAppActions } from '../../../services/state';
import { FlowKey } from '../../../services/flow';
import { Instrument } from '../../../services/instrument';
import { Staves } from '../../../services/stave';
import { Tracks } from '../../../services/track';
import { getToneDimensions, SLOT_HEIGHT } from './get-tone-dimension';
import { toMidiPitchString, toMidiPitchNumber } from '../../../playback/utils';
import { EntryType, Entry } from '../../../entries';
import { Tone } from '../../../entries/tone';
import { trackBackground } from './track-background';
import { Tick } from '../ticks/defs';
import { ToneElement } from '../tone';

import pencil from '../../../assets/pencil.svg';
import eraser from '../../../assets/eraser.svg';

import './styles.css';


interface Props {
    flowKey: FlowKey;
    color: string;
    instrument: Instrument;
    staves: Staves;
    tracks: Tracks;
    ticks: Tick[];
}

function getPitchFromYPosition(y: number, highestPitch: number, slotHeight: number) {
    const base = highestPitch;
    const slot = Math.floor(y / slotHeight);
    return toMidiPitchString(base - slot);
}

function getTickFromXPosition(x: number, ticks: Tick[], snap: number, forceFloor: boolean) {
    for (let i = 0; i < ticks.length; i++) {
        const tick = ticks[i];
        if (tick.x > x) {

            // when we first create a tone we want the X position to always be on the low edge of the snap
            const roundDown = tick.x / tick.width <= .5 || forceFloor;
            if (roundDown) {
                return Math.floor((i - 1) / snap) * snap;
            } else {
                return Math.ceil((i - 1) / snap) * snap;
            }

        }
    }
    return 0;
}

export const InstrumentTrack: FC<Props> = ({ color, instrument, staves, tracks, ticks, flowKey }) => {

    const { tool, selected } = useAppState(s => {
        return {
            tool: s.ui.tool[TabState.play],
            selected: s.ui.selected[TabState.play]
        }
    });
    const actions = useAppActions();

    const snap = 3; // this need to be generated based on the subdevisions (3/12 === semi-quaver)
    const highestPitch = toMidiPitchNumber('E5');

    // clear selection when any .intrument-track is clicked
    useEffect(() => {
        const callback = (e: any) => {
            const target = e.target as HTMLElement;
            if (tool === Tool.select && target.classList.contains('instrument-track')) {
                actions.ui.selected[TabState.play].set(undefined);
            }
        }
        window.addEventListener('pointerdown', callback);
        return () => {
            window.removeEventListener('pointerdown', callback);
        }
    }, [tool, actions.ui.selected[TabState.play]]);

    const startWrite = useCallback((e: PointerEvent<HTMLDivElement>) => {
        if (tool === Tool.pencil) {

            actions.ui.selected[TabState.play].set(undefined);

            const staveKey = instrument.staves[0];
            const trackKey = staves[staveKey].tracks[0];

            const box = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - box.left;
            const y = e.clientY - box.top;
            const pitch = getPitchFromYPosition(y, highestPitch, SLOT_HEIGHT);
            const start = getTickFromXPosition(x, ticks, snap, true);
            const tone = actions.score.instruments.createTone(flowKey, trackKey, { pitch, duration: snap }, start);

            actions.ui.selected[TabState.play].set(tone._key);

            const move = (e: any) => {
                const x = e.clientX - box.left;
                const duration = getTickFromXPosition(x, ticks, snap, false) - start;
                actions.score.instruments.updateTone(flowKey, trackKey, tone._key, { duration: duration >= snap ? duration : snap });
            }

            const end = (e: any) => {
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', end);
            }

            window.addEventListener('pointermove', move, { passive: true });
            window.addEventListener('pointerup', end, { passive: true });

        }

    }, [ticks, flowKey, highestPitch, instrument.staves, staves, tool, actions.score.instruments, actions.ui.selected[TabState.play]]);

    const tones = useMemo(() => {
        const output: Array<{ toneKey: string, trackKey: string, top: number, left: number, width: number }> = [];
        instrument.staves.forEach(staveKey => {
            const stave = staves[staveKey];
            stave.tracks.forEach(trackKey => {
                const track = tracks[trackKey];
                track.entries.order.forEach(entryKey => {
                    if (track.entries.byKey[entryKey]._type === EntryType.tone) {
                        const entry = track.entries.byKey[entryKey] as Entry<Tone>;
                        const [top, left, width] = getToneDimensions(highestPitch, entry, ticks);
                        output.push({ toneKey: entry._key, trackKey, top, left, width });
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
                return 'default'
        }
    }, [tool]);

    return <div className={merge("instrument-track", { "no-scroll": tool === Tool.pencil })} onPointerDown={startWrite} style={{ backgroundImage: trackBackground, cursor }}>
        {tones.map(({ toneKey, trackKey, top, left, width }) => {
            return <ToneElement key={toneKey} toneKey={toneKey} color={color} tool={tool} selected={toneKey === selected} top={top} left={left} width={width} onSelect={key => actions.ui.selected[TabState.play].set(key)} onErase={key => actions.score.instruments.removeTone(flowKey, trackKey, key)} />
        })}
    </div >;
}

