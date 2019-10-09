import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { mdiPlus } from '@mdi/js';

import { Icon } from '../ui';
import { Flow } from '../services/flow';

import './flow-list.css';
import { FlowItem } from './flow-item';

interface Props {
  flows: Flow[];
  selectedKey: string | null;

  onSelect: (key: string) => void;
  onRemoveFlow: (flow: Flow) => void;
  onCreateFlow: () => void;
}

export const FlowList = SortableContainer<Props>((props: Props) => {
  const { flows, selectedKey, onSelect, onRemoveFlow, onCreateFlow } = props;
  return <div className="flow-list">
    <div className="flow-list__header">
      <span>Flows</span>
      <Icon size={24} color="#ffffff" path={mdiPlus} onClick={onCreateFlow} />
    </div>
    <div className="flow-list__content">
      {flows.map((flow, i) => <FlowItem
        index={i}
        key={flow.key}
        flow={flow}

        selected={flow.key === selectedKey}

        onSelect={onSelect}
        onRemoveFlow={onRemoveFlow}
      />)}
    </div>
  </div>;
});

