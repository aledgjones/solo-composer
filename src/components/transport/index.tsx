import React, { FC } from 'react';
import { mdiPlay, mdiMetronome, mdiFastForward, mdiRewind, mdiSkipPrevious } from '@mdi/js';

import { THEME } from '../../const';
import { Icon, useForeground } from 'solo-ui';

import './styles.css';

export const Transport: FC = () => {

    const fg = useForeground(THEME.grey[400]);

    return <div className="transport" style={{ backgroundColor: THEME.grey[400], color: fg }}>
        <div className="transport__controls">
            <Icon onClick={() => false} className="transport__icon" size={24} color={fg} path={mdiSkipPrevious} />
            <Icon onClick={() => false} className="transport__icon" size={24} color={fg} path={mdiRewind} />
            <Icon onClick={() => false} className="transport__icon" size={24} color={fg} path={mdiFastForward} />
            <Icon onClick={() => false} className="transport__icon" size={24} color={fg} path={mdiPlay} />
        </div>
        <div className="transport__timestamp">
            <span>0.0.0.000</span>
        </div>
        <div className="transport__metronome" style={{ backgroundColor: THEME.grey[500] }}>
            <Icon size={24} color={fg} path={mdiMetronome} />
        </div>
    </div>
}