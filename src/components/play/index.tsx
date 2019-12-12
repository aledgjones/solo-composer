import React, { FC, useState, useMemo, useCallback, useEffect } from 'react';

import { State, Actions } from '../../services/state';

import { Select, Option, Button } from '../../ui';
import { Theme } from '../../const';

import { getCounts } from '../../services/instrument';
import { PlayerControls } from './player-contols';
import { useTicks } from './ticks';
import { merge } from '../../ui/utils/merge';
import { showcase } from '../../playback/showcase';

import './play.css';

interface Props {
    state: State;
    actions: Actions;
}

export const Play: FC<Props> = ({ state, actions }) => {

    const [play, setPlay] = useState();

    useEffect(() => {
        showcase().then(resp => {
            console.log('sounds loaded');
            setPlay(() => {
                return resp;
            });
        });
    }, []);


    const [zoom, setZoom] = useState<number>(1.5);
    const [flowKey, setFlowKey] = useState(state.score.flows.order[0]);
    const [expanded, setExpanded] = useState<string[]>([]);

    const flow = state.score.flows.byKey[flowKey];

    const counts = getCounts(state.score.players, state.score.instruments, state.score.config);
    const ticks = useTicks(flow, zoom);

    return <>
        <div className="play">

            <div className="play__x-fixed">
                <div className="play__header-select">
                    <Select className="play__select" dark required color={Theme.primary} value={flowKey} onChange={setFlowKey}>
                        {state.score.flows.order.map((key, i) => {
                            const title = `${i + 1}. ${state.score.flows.byKey[key].title}`;
                            return <Option key={key} value={key} displayAs={title}>{title}</Option>
                        })}
                    </Select>
                </div>
                <div className="play__player-controls">
                    {state.score.players.order.map(playerKey => {
                        if (flow.players.includes(playerKey)) {
                            const player = state.score.players.byKey[playerKey];
                            return <PlayerControls key={playerKey} player={player} instruments={state.score.instruments} counts={counts} />
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>

            <div className="play__scrollable">
                <div className="play__ticks">
                    {ticks.map((tick, i) => {
                        return <div key={i} style={{ width: tick.width, left: tick.x }} className={merge('play__tick', { 'play__tick--first-beat': tick.isFirstBeat, 'play__tick--beat': tick.isBeat, 'play__tick--half-beat': tick.isHalfBeat })} />
                    })}
                </div>
                <div className="play__area">
                    <Button disabled={!play} color="blue" onClick={play}>play</Button>
                </div>
            </div>

        </div>
    </>;
}