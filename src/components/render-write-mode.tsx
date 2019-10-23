import React, { FC, useState } from 'react';
import { Score } from '../services/score';
import { InsertPoint } from '../ui/utils/insert-point';

import { useRenderWriteMode } from '../services/render';

import './render-write-mode.css';

interface Props {
  score: Score;
}

export const RenderWriteMode: FC<Props> = (({ score }) => {

  const [flowKey, setFlowKey] = useState(score.flows.order[0]);
  const canvas = useRenderWriteMode(score, flowKey);

  return <InsertPoint className="render-write-mode__container" insert={canvas} />;
});

