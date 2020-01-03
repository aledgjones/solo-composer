import React, { FC } from 'react';
import { mdiPiano } from '@mdi/js';

import { useInstrumentName, Instrument } from '../../services/instrument';
import { Icon } from '../../ui';
import { Keyboard } from './keyboard';

import './instrument-controls.css';

interface Props {
    instrument: Instrument;
    count: string;
    color: string;
}

export const InstrumentControls: FC<Props> = ({ instrument, count, color }) => {

    const name = useInstrumentName(instrument, count);

    return <div className="instrument-controls__wrapper" style={{borderLeft: `4px solid ${color}`}}>
        <div className="instrument-controls">
            <div className="instrument-controls__header">
                <Icon style={{ marginRight: 16 }} size={24} color="#ffffff" path={mdiPiano} />
                <span className="instrument-controls__name">{name}</span>
            </div>
        </div>
        <Keyboard />
    </div>;
}

