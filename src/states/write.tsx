import React, { FC } from 'react';

import { State, Actions } from '../services/state';

import './write.css';

interface Props {
    state: State;
    actions: Actions;
}

export const Write: FC<Props> = ({ state, actions }) => {

    

    return <>
        <div className="write">
            
        </div>
    </>;
}