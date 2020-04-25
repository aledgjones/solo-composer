import React, { FC, useMemo, CSSProperties } from 'react';

import { merge } from 'solo-ui';

import { EntryType } from "../../../entries";
import { TimeSignature } from "../../../entries/time-signature";
import { getDistanceFromBarline } from "../../../parse/get-distance-from-barline";
import { getIsBeat } from "../../../parse/get-is-beat";
import { getTicksPerBeat } from "../../../parse/get-ticks-per-beat";
import { EntriesByTick } from "../../../services/track";
import { getEntriesAtTick } from '../../../parse/get-entry-at-tick';
import { getBeatGroupingBoundries } from '../../../parse/get-beat-group-boundries';
import { getDefaultGroupings } from '../../../parse/get-default-groupings';
import { Tick } from './defs';

import './styles.css';

interface Props {
    ticks: Tick[];
    className?: string;
    style?: CSSProperties;
}

export const Ticks: FC<Props> = ({ ticks, className, style }) => {

    // we can merge ticks that arent beats to reduce the number of element created.
    const merged = useMemo(() => {
        return ticks.reduce<Tick[]>((out, tick) => {
            if (!tick.isBeat) {
                out[out.length - 1].width = out[out.length - 1].width + tick.width;
            } else {
                // make a copy else reference kept to original.
                out.push({ ...tick });
            }

            return out;
        }, []);
    }, [ticks]);

    return <div className={merge("ticks", className)} style={style}>
        {merged.map((tick, i) => {
            return <div key={i} style={{ width: tick.width }} className={merge('tick', { 'tick--first-beat': tick.isFirstBeat, 'tick--boundry': tick.isGroupingBoundry })} />;
        })}
    </div>;
}

export function useTicks(length: number, flowEntriesByTick: EntriesByTick, zoom: number): Tick[] {
    return useMemo(() => {

        const CROTCHET_WIDTH = 72;

        const ticks = [];

        let timeSigResult;
        let beatGroupingBoundries: number[] = [];
        let x = 0;
        
        for (let tick = 0; tick < length + 1; tick++) {
            const result = getEntriesAtTick<TimeSignature>(tick, flowEntriesByTick, EntryType.timeSignature);
            if (result.entries[0]) {
                timeSigResult = result;
            }
            const timeSigAt = timeSigResult?.at || 0;
            const timeSig = timeSigResult?.entries[0];

            const ticksPerBeat = getTicksPerBeat(timeSig?.subdivisions, timeSig?.beatType);
            const ticksPerCrotchet = getTicksPerBeat(timeSig?.subdivisions, 4);

            const width = Math.ceil((CROTCHET_WIDTH / ticksPerCrotchet) * zoom);

            const isBeat = getIsBeat(tick, ticksPerBeat, timeSigAt);
            const distanceFromBarline = getDistanceFromBarline(tick, ticksPerBeat, timeSigAt, timeSig?.beats);
            const isFirstBeat = distanceFromBarline === 0;

            if (isFirstBeat) {
                beatGroupingBoundries = getBeatGroupingBoundries(timeSigAt + (tick - timeSigAt), ticksPerBeat, timeSig?.groupings || getDefaultGroupings(4));
            }

            const isGroupingBoundry = beatGroupingBoundries.includes(tick);

            ticks.push({ x, width, isBeat, isFirstBeat, isGroupingBoundry });

            x += width;
        }

        return ticks;

    }, [length, flowEntriesByTick, zoom]);
}