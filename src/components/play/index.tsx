import React, { FC, useState, useCallback, useMemo } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';

import { useAppState } from '../../services/state';
import { Score } from '../../services/score';

import { Select, Option } from '../../ui';
import { THEME } from '../../const';

import { useCounts } from '../../services/instrument';
import { PlayerControls } from './player-contols';
import { useTicks, Ticks } from './ticks';
import { PlayerTrack } from './player-track';
import { entriesByTick } from '../../services/track';
import { PlaySettings } from '../../dialogs/play-settings';

import './play.css';

interface Props {
    settings: boolean;
    onSettingsClose: () => void;
}

export const Play: FC<Props> = ({ settings, onSettingsClose }) => {

    const score = useAppState<Score>(s => s.score);

    const [zoom, setZoom] = useState<number>(1.5);
    const [flowKey, setFlowKey] = useState(score.flows.order[0]);
    const [expanded, setExpanded] = useState<string[]>([]);

    const colors = useMemo(() => {

        const len = score.players.order.length > 9 ? score.players.order.length : 9;

        const offset = 206;
        const width = 359 - 100;
        const step = Math.floor(width / len);

        return Array(len).fill('').map((entry, i) => {
            const base = (step * i) + offset;
            const color = `hsl(${base > 359 ? base - 359 : base}, 100%, 35%)`;
            return color;
        });

    }, [score.players.order.length]);

    const onToggleExpand = useCallback((key: string) => {
        setExpanded(current => {
            const filtered = current.filter(item => item !== key);
            if (filtered.length === current.length) {
                return [...current, key];
            } else {
                return filtered;
            }
        })
    }, []);

    const flow = score.flows.byKey[flowKey];
    const flowEntriesByTick = useMemo(() => entriesByTick(flow.master.entries.order, flow.master.entries.byKey), [flow.master.entries]);

    const counts = useCounts();
    const ticks = useTicks(flow.length, flowEntriesByTick, zoom);

    return <>

        <ScrollContainer ignoreElements=".play__x-fixed" vertical={false} className="play">

            <div className="play__x-fixed">
                <div className="play__header-select">
                    <Select className="play__select" dark required color={THEME.primary[500].bg} value={flowKey} onChange={setFlowKey}>
                        {score.flows.order.map((key, i) => {
                            const title = `${i + 1}. ${score.flows.byKey[key].title}`;
                            return <Option key={key} value={key} displayAs={title}>{title}</Option>
                        })}
                    </Select>
                </div>
                <div className="play__player-controls">
                    {score.players.order.map((playerKey, i) => {
                        if (flow.players.includes(playerKey)) {
                            const player = score.players.byKey[playerKey];
                            return <PlayerControls key={playerKey} color={colors[i]} expanded={expanded.includes(playerKey)} player={player} instruments={score.instruments} counts={counts} onToggleExpand={onToggleExpand} />
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>

            <div className="play__scrollable">
                <Ticks className="play__ticks" ticks={ticks} />
                <div className="play__track-area">
                    {score.players.order.map((playerKey, i) => {
                        if (flow.players.includes(playerKey)) {
                            const player = score.players.byKey[playerKey];
                            return <PlayerTrack key={playerKey} color={colors[i]} expanded={expanded.includes(playerKey)} player={player} instruments={score.instruments} staves={flow.staves} tracks={flow.tracks} ticks={ticks} />
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>

        </ScrollContainer>

        {settings && <PlaySettings onClose={() => onSettingsClose()} />}
    </>;
}