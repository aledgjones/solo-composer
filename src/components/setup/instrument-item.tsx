import React, { FC, useMemo } from 'react';
import { mdiChevronRight } from '@mdi/js';
import Color from 'color';

import { THEME } from '../../const';
import { Instrument, useInstrumentName } from '../../services/instrument';
import { Icon } from '../../ui';

import './instrument-item.css';
import { Text } from '../shared/text';

interface Props {
  selected: boolean;
  instrument: Instrument;
  count?: string;
}

export const InstrumentItem: FC<Props> = ({ selected, instrument, count }) => {

  const bg: string = useMemo(() => {
    if (selected) {
      return Color(THEME.primary).lighten(.3).string();
    } else {
      return 'rgb(57, 66, 71)';
    }
  }, [selected]);

  const fg = useMemo(() => {
    return Color(bg).isDark() ? '#ffffff' : '#000000';
  }, [bg]);

  const name = useInstrumentName(instrument, count);

  return <div className="instrument-item" style={{ backgroundColor: bg, color: fg }}>
    <Text className="instrument-item__name">{name}</Text>
    <Icon style={{ marginLeft: 8 }} size={18} color={fg} path={mdiChevronRight} />
  </div>;
}