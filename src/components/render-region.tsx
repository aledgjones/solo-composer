import React, { FC, useMemo } from 'react';

import { merge } from 'solo-ui';

import { THEME } from '../const';
import { DragScroll } from './drag-scroll';

import './render-region.css';

interface Props {
  className?: string;
}

export const RenderRegion: FC<Props> = (({ children, className }) => {

  const bg = useMemo(() => {
    const start = THEME.primary[400];
    const stop = THEME.primary[700];
    return `linear-gradient(${start}, ${stop})`;
  }, []);

  return <DragScroll x={true} y={true} className={merge("render-region", className)} style={{ backgroundImage: bg }}>
    {children}
  </DragScroll>;
});

