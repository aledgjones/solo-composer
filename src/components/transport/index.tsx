import React, { FC } from 'react';
import { mdiPlay, mdiMetronome, mdiFastForward, mdiRewind, mdiSkipPrevious } from '@mdi/js';

import { THEME } from '../../const';
import { Icon, useForeground } from 'solo-ui';

import './styles.css';
import { useAppState, useAppActions } from '../../services/state';

export const Transport: FC = () => {

    const metronome = useAppState(s => s.playback.settings.metronome);
    const actions = useAppActions();

    const fg = useForeground(THEME.grey[300]);

    return <div className="transport">
        <div className="transport__controls">
            <Icon onClick={() => false} className="transport__icon" size={24} color={fg} path={mdiSkipPrevious} />
            <Icon onClick={() => false} className="transport__icon" size={24} color={fg} path={mdiRewind} />
            <Icon onClick={() => false} className="transport__icon" size={24} color={fg} path={mdiFastForward} />
            <Icon onClick={() => false} className="transport__icon" size={24} color={fg} path={mdiPlay} />
        </div>
        <div className="transport__timestamp" style={{ border: `1px solid ${THEME.grey[500]}`, color: fg }}>
            <span>0.0.0.000</span>
        </div>
        <div className="transport__metronome">
            <Icon toggle={metronome} onClick={actions.playback.settings.metronome.toggle} size={24} color={fg} highlight={THEME.primary[500]} path={mdiMetronome} />
        </div>
    </div>
}