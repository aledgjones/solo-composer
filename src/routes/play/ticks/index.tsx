import React, { FC, useMemo, CSSProperties } from "react";

import { merge } from "solo-ui";

import { EntryType } from "../../../entries";
import { TimeSignature } from "../../../entries/time-signature";
import { getIsBeat } from "../../../parse/get-is-beat";
import { getTicksPerBeat } from "../../../parse/get-ticks-per-beat";
import { EntriesByTick } from "../../../services/track";
import { getEntriesAtTick } from "../../../parse/get-entry-at-tick";
import { getBeatGroupingBoundries } from "../../../parse/get-beat-group-boundries";
import { getDefaultGroupings } from "../../../parse/get-default-groupings";
import { TickList, Tick } from "./defs";

import "./styles.css";

function tickHeight(tick: Tick, fixed: boolean, height: number) {

    if (tick.isFirstBeat) {
        return height;
    }

    if (tick.isGroupingBoundry) {
        return fixed ? height : 24;
    }

    if (tick.isBeat) {
        return fixed ? height : 16;
    }

    if (tick.isQuaverBeat) {
        return fixed ? 0 : 8;
    }

    return 0;
}

interface Props {
    ticks: TickList;
    height: number;
    fixed: boolean;
    color: string;
    highlight: string;
    className?: string;
    style?: CSSProperties;
}

export const Ticks: FC<Props> = ({ ticks, height, fixed, color, highlight, className, style }) => {
    return (
        <svg viewBox={`0 0 ${ticks.width} ${height}`} className={merge("ticks", className)} style={{ width: ticks.width, height, ...style }}>
            {ticks.list.map((tick, i) => {

                const y = tickHeight(tick, fixed, height);

                if (y > 0) {
                    return <line x1={tick.x} y1="0" x2={tick.x} y2={y} strokeWidth="2" stroke={tick.isFirstBeat ? highlight : color} />
                } else {
                    return null;
                }
            })}
        </svg>
    );
};

export function useTicks(length: number, flowEntriesByTick: EntriesByTick, zoom: number) {
    return useMemo(() => {
        const CROTCHET_WIDTH = 72;

        const ticks = [];

        let timeSigResult;
        let beatGroupingBoundries: number[] = [];
        let x = 0;

        for (let tick = 0; tick < length + 1; tick++) {
            const result = getEntriesAtTick<TimeSignature>(
                tick,
                flowEntriesByTick,
                EntryType.timeSignature
            );
            if (result.entries[0]) {
                timeSigResult = result;
            }
            const timeSigAt = timeSigResult?.at || 0;
            const timeSig = timeSigResult?.entries[0];

            const ticksPerBeat = getTicksPerBeat(timeSig?.subdivisions, timeSig?.beatType);
            const ticksPerQuaverBeat = getTicksPerBeat(timeSig?.subdivisions, 8);
            const ticksPerCrotchet = getTicksPerBeat(timeSig?.subdivisions, 4);

            const width = Math.ceil((CROTCHET_WIDTH / ticksPerCrotchet) * zoom);

            const isBeat = getIsBeat(tick, ticksPerBeat, timeSigAt);
            const isQuaverBeat = getIsBeat(tick, ticksPerQuaverBeat, timeSigAt); // smallest subs to show are quavers
            const isFirstBeat = getIsBeat(tick, ticksPerBeat * (timeSig?.beats || 4), timeSigAt);

            if (isFirstBeat) {
                beatGroupingBoundries = getBeatGroupingBoundries(
                    timeSigAt + (tick - timeSigAt),
                    ticksPerBeat,
                    timeSig?.groupings || getDefaultGroupings(4)
                );
            }

            const isGroupingBoundry = beatGroupingBoundries.includes(tick);

            ticks.push({ x, width, isBeat, isFirstBeat, isQuaverBeat, isGroupingBoundry });

            x += width;
        }

        return { list: ticks, width: x };
    }, [length, flowEntriesByTick, zoom]);
}
