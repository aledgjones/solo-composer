import React, { FC } from 'react';
import { mdiPiano } from '@mdi/js';

import { Icon } from 'solo-ui';

import { THEME } from '../../const';
import { useInstrumentName, Instrument } from '../../services/instrument';
import { Keyboard } from './keyboard';
import { Text } from '../../components/text';

import './instrument-controls.css';

interface Props {
    instrument: Instrument;
    count: string;
    color: string;
}

export const InstrumentControls: FC<Props> = ({ instrument, count, color }) => {
    
    const name = useInstrumentName(instrument, count);

    return <div className="instrument-controls__wrapper" style={{borderLeft: `4px solid ${color}`}}>
        <div className="instrument-controls" style={{backgroundColor: THEME.grey[700]}}>
            <div className="instrument-controls__header">
                <Icon style={{ marginRight: 16 }} size={24} color="#ffffff" path={mdiPiano} />
                <Text className="instrument-controls__name">{name}</Text>
            </div>
        </div>
        <Keyboard instrumentKey={instrument.key} />
    </div>;
}

