import React, { FC, useMemo } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import Color from 'color';

import { Theme } from '../../const';
import { merge } from '../../ui/utils/merge';

import './render-region.css';

interface Props {
  className?: string;
}

export const RenderRegion: FC<Props> = (({ children, className }) => {

  const bg = useMemo(() => {
    const start = Color(Theme.primary).lighten(.6).rgb().string();
    const stop = Color(Theme.primary).lighten(.2).rgb().string();
    return `linear-gradient(${start}, ${stop})`;
  }, []);

  return <ScrollContainer className={merge("render-region", className)} style={{ backgroundImage: bg }}>
    {children}
  </ScrollContainer>;
});

