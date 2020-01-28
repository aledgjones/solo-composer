import React, { FC, useMemo } from 'react';
import { EntryType } from "../../entries";
import { TimeSignature } from "../../entries/time-signature";
import { getDistanceFromBarline } from "../../parse/get-distance-from-barline";
import { getIsBeat } from "../../parse/get-is-beat";
import { getTicksPerBeat } from "../../parse/get-ticks-per-beat";
import { EntriesByTick } from "../../services/track";
import { merge } from '../../ui/utils/merge';
import { getEntriesAtTick } from '../../parse/get-entry-at-tick';

import './ticks.css';


interface Props {
    ticks: Tick[];
    className?: string;
}

export const Ticks: FC<Props> = ({ ticks, className }) => {
    return <div className={merge("ticks", className)}>
        {ticks.map((tick, i) => {
            return <div key={i} style={{ width: tick.width }} className={merge('tick', { 'tick--first-beat': tick.isFirstBeat, 'tick--beat': tick.isBeat, 'tick--half-beat': tick.isHalfBeat })} />;
        })}
    </div>;
}

export interface Tick {
    x: number;
    width: number;
    isBeat: boolean;
    isHalfBeat: boolean;
    isFirstBeat: boolean;
}

export function useTicks(length: number, flowEntriesByTick: EntriesByTick, zoom: number): Tick[] {
    return useMemo(() => {
        let timeSigResult;
        const ticks = [];
        let x = 0;
        for (let tick = 0; tick < length + 1; tick++) {
            const result = getEntriesAtTick<TimeSignature>(tick, flowEntriesByTick, EntryType.timeSignature);
            if (result.entries[0]) {
                timeSigResult = result;
            }
            const timeSigAt = timeSigResult?.at;
            const timeSig = timeSigResult?.entries[0];

            const ticksPerBeat = getTicksPerBeat(timeSig?.subdivisions, timeSig?.beatType);
            const ticksPerQuaver = getTicksPerBeat(timeSig?.subdivisions, 8);

            const width = Math.ceil((36 / ticksPerQuaver) * zoom);
            const isBeat = getIsBeat(tick, ticksPerBeat, timeSigAt);
            const isHalfBeat = getIsBeat(tick, ticksPerQuaver, timeSigAt);
            const isFirstBeat = getDistanceFromBarline(tick, ticksPerBeat, timeSigAt, timeSig?.beats) === 0;

            ticks.push({ x, width, isBeat, isHalfBeat, isFirstBeat });

            x += width;
        }
        return ticks;
    }, [length, flowEntriesByTick, zoom]);
}