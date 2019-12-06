import React, { FC, useState, useMemo } from 'react';
import { Score } from '../../services/score';
import { InsertPoint } from '../../ui/utils/insert-point';

import { Theme } from '../../const';
import Color from 'color';

import { useRenderWriteMode } from '../../render/use-render-write-mode';

import './render-write-mode.css';

interface Props {
  score: Score;
}

export const RenderWriteMode: FC<Props> = (({ score }) => {

  const [flowKey, setFlowKey] = useState(score.flows.order[0]);
  const canvas = useRenderWriteMode(score, flowKey);

  const fg = useMemo(() => {
    return Color(Theme.primary).isDark() ? '#ffffff' : '#000000';
  }, []);

  return <div className="render-write-mode">
    <p className="render-write-mode__flow-name" style={{ color: fg, backgroundColor: Theme.primary }}>{score.flows.byKey[flowKey].title}</p>
    <InsertPoint className="render-write-mode__container" insert={canvas} />
  </div>;
});

