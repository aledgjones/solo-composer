import React, { FC, useMemo } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';

import { THEME } from '../../const';
import { merge } from '../../ui/utils/merge';

import './render-region.css';

interface Props {
  className?: string;
}

export const RenderRegion: FC<Props> = (({ children, className }) => {

  const bg = useMemo(() => {
    const start = THEME.primary[400].bg;
    const stop = THEME.primary[700].bg;
    return `linear-gradient(${start}, ${stop})`;
  }, []);

  return <ScrollContainer className={merge("render-region", className)} style={{ backgroundImage: bg }}>
    {children}
  </ScrollContainer>;
});

