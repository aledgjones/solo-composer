import React, { FC } from 'react';
import { mdiPlay, mdiStop, mdiMetronome, mdiFastForward, mdiRewind, mdiSkipPrevious } from '@mdi/js';

import { Icon } from '../ui';

import './transport.css';

export const Transport: FC = () => {
    return <div className="transport">
        <div className="transport__controls">
            <Icon className="transport__icon--margin" size={24} color="white" path={mdiSkipPrevious} />
            <Icon className="transport__icon--margin" size={24} color="white" path={mdiRewind} />
            <Icon className="transport__icon--margin" size={24} color="white" path={mdiFastForward} />
            <Icon className="transport__icon--margin" size={24} color="white" path={mdiPlay} />
            <Icon size={24} color="white" path={mdiStop} />
        </div>
        <div className="transport__metronome">
            <Icon size={24} color="white" path={mdiMetronome} />
        </div>
    </div>
}