import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { mdiPlus } from '@mdi/js';

import { Icon } from '../../ui';
import { Flow, FlowKey } from '../../services/flow';
import { FlowItem } from './flow-item';
import { Selection, SelectionType } from '.';

import './flow-list.css';

interface Props {
    flows: Flow[];
    selection: Selection;

    onSelectFlow: (flowKey: FlowKey, type: SelectionType) => void;
    onCreateFlow: () => void;
    onRemoveFlow: (flowKey: FlowKey) => void;
    onAssignPlayer: (flowKey: FlowKey) => void;
    onRemovePlayer: (flowKey: FlowKey) => void;
}

export const FlowList = SortableContainer<Props>((props: Props) => {
    const { flows, selection, onSelectFlow, onCreateFlow, onRemoveFlow, onAssignPlayer, onRemovePlayer } = props;

    return <div className="flow-list">
        <div className="flow-list__header">
            <span>Flows</span>
            <Icon size={24} color="#ffffff" path={mdiPlus} onClick={onCreateFlow} />
        </div>
        <div className="flow-list__wrapper">
            <div className="flow-list__content">
                {flows.map((flow, i) => <FlowItem
                    index={i}
                    key={flow.key}
                    flow={flow}

                    selection={selection}

                    onSelectFlow={onSelectFlow}
                    onRemoveFlow={onRemoveFlow}
                    onAssignPlayer={onAssignPlayer}
                    onRemovePlayer={onRemovePlayer}
                />)}
            </div>
        </div>
    </div>;
});

