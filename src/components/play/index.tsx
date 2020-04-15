import React, { FC, useState, useMemo } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';

import { Select, Option, useRainbow } from 'solo-ui';

import { THEME } from '../../const';
import { useAppState, useAppActions } from '../../services/state';
import { TabState } from '../../services/ui';
import { useCounts } from '../../services/instrument';
import { entriesByTick } from '../../services/track';
import { useTicks, Ticks } from './ticks';
import { PlayerControls } from './player-contols';
import { PlayerTrack } from './player-track';
import { PlaySettings } from '../../dialogs/play-settings';

import './play.css';

interface Props {
    settings: boolean;
    onSettingsClose: () => void;
}

const Play: FC<Props> = ({ settings, onSettingsClose }) => {

    const { score, expanded } = useAppState(s => {
        return {
            score: s.score,
            expanded: s.ui.expanded[TabState.play]
        }
    });
    const actions = useAppActions();

    const [zoom] = useState<number>(1);
    const [flowKey, setFlowKey] = useState(score.flows.order[0]);
    const colors = useRainbow(score.players.order.length);

    const flow = score.flows.byKey[flowKey];
    const flowEntriesByTick = useMemo(() => entriesByTick(flow.master.entries.order, flow.master.entries.byKey), [flow.master.entries]);

    const counts = useCounts();
    const ticks = useTicks(flow.length, flowEntriesByTick, zoom);

    return <>

        <ScrollContainer ignoreElements=".no-scroll" vertical={false} className="play">

            <div className="play__x-fixed no-scroll">
                <div className="play__header-select">
                    <Select className="play__select" label="" color={THEME.primary[500].bg} value={flowKey} onChange={setFlowKey}>
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
                            return <PlayerControls key={playerKey} color={colors[i]} expanded={expanded[playerKey]} player={player} instruments={score.instruments} counts={counts} onToggleExpand={actions.ui.expanded.play.toggle} />
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
                            return <PlayerTrack key={playerKey} flowKey={flowKey} color={colors[i]} expanded={expanded[playerKey]} player={player} instruments={score.instruments} staves={flow.staves} tracks={flow.tracks} ticks={ticks} />
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>

        </ScrollContainer>

        <PlaySettings open={settings} onClose={() => onSettingsClose()} />
    </>;
}

export default Play;