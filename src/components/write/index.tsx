import React, { FC } from 'react';

import { State, Actions } from '../../services/state';

import { RenderRegion } from '../shared/render-region';
import { RenderWriteMode } from '../shared/render-write-mode';

import './write.css';

interface Props {
    state: State;
    actions: Actions;
}

export const Write: FC<Props> = ({ state, actions }) => {
    return <>
        <div className="write">
            <RenderRegion>
                <RenderWriteMode score={state.score} />
            </RenderRegion>
        </div>
    </>;
}