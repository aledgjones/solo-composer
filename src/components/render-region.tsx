import React, { FC, useMemo } from 'react';
import Color from 'color';

import { THEME } from '../const';

import './render-region.css';

interface Props {

}

export const RenderRegion: FC<Props> = (({ }) => {

  const bg = useMemo(() => {
    const start = Color(THEME.PRIMARY).lighten(.6).rgb().string();
    const stop = Color(THEME.PRIMARY).lighten(.2).rgb().string();
    return `linear-gradient(${start}, ${stop})`;
  }, []);

  return <div className="render-region" style={{ backgroundImage: bg }}>
  </div>;
});

