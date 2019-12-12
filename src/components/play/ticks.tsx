import { entriesByTick } from "../../services/track";
import { useMemo } from "react";
import { getNearestEntryToTick } from "../../parse/get-nearest-entry-to-tick";
import { getTicksPerBeat } from "../../parse/get-ticks-per-beat";
import { TimeSignature } from "../../entries/time-signature";
import { EntryType } from "../../entries";
import { getIsBeat } from "../../parse/get-is-beat";
import { Flow } from '../../services/flow';
import { getDistanceFromBarline } from "../../parse/get-distance-from-barline";

export function useTicks(flow: Flow, zoom: number) {

    const flowEntriesByTick = useMemo(() => entriesByTick(flow.master.entries.order, flow.master.entries.byKey), [flow.master.entries]);

    return useMemo(() => {
        const ticks = [];
        let x = 0;
        for (let tick = 0; tick < flow.length + 1; tick++) {
            const timeSig = getNearestEntryToTick<TimeSignature>(tick, flowEntriesByTick, EntryType.timeSignature);
            const subdivisions = timeSig.entry ? timeSig.entry.subdivisions : 12;
            const beatType = timeSig.entry ? timeSig.entry.beatType : 4;

            const ticksPerBeat = getTicksPerBeat(subdivisions, beatType);
            const ticksPerQuaver = getTicksPerBeat(subdivisions, 8);

            const width = Math.ceil((36 / ticksPerQuaver) * zoom);
            const isBeat = getIsBeat(tick, ticksPerBeat, timeSig.at);
            const isHalfBeat = getIsBeat(tick, ticksPerQuaver, timeSig.at);
            const isFirstBeat = getDistanceFromBarline(tick, ticksPerBeat, timeSig.at, timeSig.entry ? timeSig.entry.beats : 0) === 0;

            ticks.push({ x, width, isBeat, isHalfBeat, isFirstBeat });

            x += width;
        }
        return ticks;
    }, [flow.length, flowEntriesByTick, zoom]);
}