import React, { FC, useMemo } from 'react';
import { mdiChevronRight } from '@mdi/js';

import { THEME } from '../../const';
import { Instrument, useInstrumentName } from '../../services/instrument';
import { Icon } from '../../ui';
import { Text } from '../shared/text';

import './instrument-item.css';

interface Props {
  selected: boolean;
  instrument: Instrument;
  count?: string;
}

export const InstrumentItem: FC<Props> = ({ selected, instrument, count }) => {

  const { bg, fg } = useMemo(() => {
    if (selected) {
      return THEME.primary[600];
    } else {
      return THEME.grey[700];
    }
  }, [selected]);

  const name = useInstrumentName(instrument, count);

  return <div className="instrument-item" style={{ backgroundColor: bg, color: fg }}>
    <Text className="instrument-item__name">{name}</Text>
    <Icon style={{ marginLeft: 8 }} size={18} color={fg} path={mdiChevronRight} />
  </div>;
}