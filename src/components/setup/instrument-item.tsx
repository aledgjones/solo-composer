import React, { FC, useMemo } from 'react';
import { mdiChevronRight } from '@mdi/js';

import { Icon, useForeground } from 'solo-ui';

import { THEME } from '../../const';
import { Instrument, useInstrumentName } from '../../services/instrument';
import { Text } from '../shared/text';

import './instrument-item.css';

interface Props {
  selected: boolean;
  instrument: Instrument;
  count?: string;
}

export const InstrumentItem: FC<Props> = ({ selected, instrument, count }) => {

  const bg = useMemo(() => {
    if (selected) {
      return THEME.primary[600];
    } else {
      return THEME.grey[700];
    }
  }, [selected]);
  const fg = useForeground(bg);

  const name = useInstrumentName(instrument, count);

  return <div className="instrument-item" style={{ backgroundColor: bg, color: fg }}>
    <Text className="instrument-item__name">{name}</Text>
    <Icon style={{ marginLeft: 8 }} size={18} color={fg} path={mdiChevronRight} />
  </div>;
}