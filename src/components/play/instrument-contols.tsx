import React, { FC } from 'react';
import { mdiPiano } from '@mdi/js';

import { Icon } from '../../ui';

import { useInstrumentName, Instrument } from '../../services/instrument';

import './instrument-controls.css';

interface Props {
    instrument: Instrument;
    count: string;
}

export const InstrumentControls: FC<Props> = ({ instrument, count }) => {

    const name = useInstrumentName(instrument, count);

    return <div className="instrument-controls">
        <div className="instrument-controls__header">
            <Icon style={{ marginRight: 16 }} size={24} color="#ffffff" path={mdiPiano} />
            <span className="instrument-controls__name">{name}</span>
        </div>
        {/* {player.instruments.map(instrumentKey => {
            const instrument = instruments[instrumentKey];
            return <div className="">
                {name}
            </div>;
        })}; */}
    </div>;
}

