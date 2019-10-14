import React, { FC } from 'react';

import { State, Actions } from '../services/state';

import { RenderRegion } from '../components/render-region';

import './write.css';

interface Props {
    state: State;
    actions: Actions;
}

export const Write: FC<Props> = ({ state, actions }) => {

    

    return <>
        <div className="write">
            <RenderRegion />
        </div>
    </>;
}