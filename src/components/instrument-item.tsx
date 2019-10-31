import React, { FC, useMemo } from 'react';
import { mdiChevronRight } from '@mdi/js';
import Color from 'color';

import { Theme } from '../const';
import { Instrument } from '../services/instrument';
import { Icon } from '../ui';

import './instrument-item.css';

interface Props {
  selected: boolean;
  instrument: Instrument;
  count?: string;
}

export const InstrumentItem: FC<Props> = ({ selected, instrument, count }) => {

  const bg: string = useMemo(() => {
    if (selected) {
      return Color(Theme.primary).lighten(.3).rgb().string();
    } else {
      return 'rgb(57, 66, 71)';
    }
  }, [selected]);

  const fg = useMemo(() => {
    return Color(bg).isDark() ? '#ffffff' : '#000000';
  }, [bg]);

  const name = useMemo(() => {
    return instrument.longName + (count ? ` ${count}` : '');
  }, [instrument, count]);

  return <div className="instrument-item" style={{ backgroundColor: bg, color: fg }}>
    <span>{name}</span>
    <Icon style={{ marginLeft: 8 }} size={18} color={fg} path={mdiChevronRight} />
  </div>;
}