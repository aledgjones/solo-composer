import React, { FC, useMemo } from 'react';
import { EntryType } from "../../entries";
import { TimeSignature } from "../../entries/time-signature";
import { getDistanceFromBarline } from "../../parse/get-distance-from-barline";
import { getIsBeat } from "../../parse/get-is-beat";
import { getNearestEntriesToTick } from "../../parse/get-nearest-entry-to-tick";
import { getTicksPerBeat } from "../../parse/get-ticks-per-beat";
import { EntriesByTick } from "../../services/track";
import { merge } from '../../ui/utils/merge';

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
        const ticks = [];
        let x = 0;
        for (let tick = 0; tick < length + 1; tick++) {
            const timeSigResult = getNearestEntriesToTick<TimeSignature>(tick, flowEntriesByTick, EntryType.timeSignature);
            const timeSig = timeSigResult.entries[0];
            const subdivisions = timeSig ? timeSig.subdivisions : 12;
            const beatType = timeSig ? timeSig.beatType : 4;

            const ticksPerBeat = getTicksPerBeat(subdivisions, beatType);
            const ticksPerQuaver = getTicksPerBeat(subdivisions, 8);

            const width = Math.ceil((36 / ticksPerQuaver) * zoom);
            const isBeat = getIsBeat(tick, ticksPerBeat, timeSigResult.at);
            const isHalfBeat = getIsBeat(tick, ticksPerQuaver, timeSigResult.at);
            const isFirstBeat = getDistanceFromBarline(tick, ticksPerBeat, timeSigResult.at, timeSig ? timeSig.beats : undefined) === 0;

            ticks.push({ x, width, isBeat, isHalfBeat, isFirstBeat });

            x += width;
        }
        return ticks;
    }, [length, flowEntriesByTick, zoom]);
}