import React, { FC, useState } from 'react';

import { State, Actions } from '../../services/state';

import { Select, Option } from '../../ui';
import { Theme } from '../../const';

import './play.css';

interface Props {
    state: State;
    actions: Actions;
}

export const Play: FC<Props> = ({ state, actions }) => {

    const [flowKey, setFlowKey] = useState(state.score.flows.order[0]);
    const flow = state.score.flows.byKey[flowKey];

    return <>
        <div className="play">
            <div className="play__header">
                <div className="play__header-left">
                    <Select dark required color={Theme.primary} value={flowKey} onChange={setFlowKey}>
                        {state.score.flows.order.map((key, i) => {
                            const title = `${i + 1}. ${state.score.flows.byKey[key].title}`;
                            return <Option key={key} value={key} displayAs={title}>{title}</Option>
                        })}
                    </Select>
                </div>
            </div>
        </div>
    </>;
}