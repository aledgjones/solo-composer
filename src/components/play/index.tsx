import React, { FC, useState, useMemo } from 'react';
import { mdiCursorDefault, mdiEraser, mdiPencil } from '@mdi/js';
import ScrollContainer from 'react-indiana-drag-scroll';

import { Select, Option, useRainbow, Dialog, Icon, useForeground } from 'solo-ui';

import { THEME } from '../../const';
import { useAppState, useAppActions } from '../../services/state';
import { TabState, Tool } from '../../services/ui';
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

    const { score, expanded, tool } = useAppState(s => {
        return {
            score: s.score,
            expanded: s.ui.expanded[TabState.play],
            tool: s.ui.tool[TabState.play]
        }
    });
    const actions = useAppActions();

    const [zoom] = useState<number>(1);

    const [flowKey, setFlowKey] = useState(score.flows.order[0]);
    const flow = score.flows.byKey[flowKey];
    const flowEntriesByTick = useMemo(() => entriesByTick(flow.master.entries.order, flow.master.entries.byKey), [flow.master.entries]);

    const counts = useCounts();
    const ticks = useTicks(flow.length, flowEntriesByTick, zoom);

    const colors = useRainbow(score.players.order.length);
    const fg = useForeground(THEME.grey[400]);

    return <>

        <ScrollContainer ignoreElements=".no-scroll" vertical={false} className="play">

            <div className="play__x-fixed play__left-panel no-scroll">

                <div className="play__tools" style={{ backgroundColor: THEME.grey[500], borderRight: `4px solid ${THEME.grey[400]}` }}>
                    <Icon className="play__tool" toggle={tool === Tool.select} onClick={() => actions.ui.tool.play.set(Tool.select)} path={mdiCursorDefault} size={24} color={fg} highlight={THEME.primary[500]}></Icon>
                    <Icon className="play__tool" toggle={tool === Tool.pencil} onClick={() => actions.ui.tool.play.set(Tool.pencil)} path={mdiPencil} size={24} color={fg} highlight={THEME.primary[500]}></Icon>
                    <Icon className="play__tool" toggle={tool === Tool.eraser} onClick={() => actions.ui.tool.play.set(Tool.eraser)} path={mdiEraser} size={24} color={fg} highlight={THEME.primary[500]}></Icon>
                </div>

                <div className="play__controls" style={{ backgroundColor: THEME.grey[500] }}>
                    <div className="play__header-select" style={{ backgroundColor: THEME.grey[400] }}>
                        <Select className="play__select" label="" color="white" value={flowKey} onChange={setFlowKey}>
                            {score.flows.order.map(key => {
                                const title = score.flows.byKey[key].title;
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

            </div>

            <div className="play__scrollable" style={{ backgroundColor: THEME.grey[500] }}>
                <Ticks className="play__ticks" ticks={ticks} style={{ backgroundColor: THEME.grey[400] }} />
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

        <Dialog open={settings} width={900}>
            {() => <PlaySettings onClose={() => onSettingsClose()} />}
        </Dialog>
    </>;
}

export default Play;