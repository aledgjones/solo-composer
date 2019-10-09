import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { mdiPlus } from '@mdi/js';

import { Icon } from '../ui';
import { Flow } from '../services/flow';
import { FlowItem } from './flow-item';
import { Selection, SelectionType } from '../states/setup';

import './flow-list.css';

interface Props {
  flows: Flow[];
  selection: Selection;

  onSelect: (key: string, type: SelectionType) => void;
  onRemoveFlow: (flow: Flow) => void;
  onCreateFlow: () => void;
}

export const FlowList = SortableContainer<Props>((props: Props) => {
  const { flows, selection, onSelect, onRemoveFlow, onCreateFlow } = props;

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

        selection={selection}

        onSelect={onSelect}
        onRemoveFlow={onRemoveFlow}
      />)}
    </div>
  </div>;
});

