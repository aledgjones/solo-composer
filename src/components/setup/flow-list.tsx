import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { mdiPlus } from '@mdi/js';

import { Icon, useForeground } from 'solo-ui';

import { Flow, FlowKey } from '../../services/flow';
import { FlowItem } from './flow-item';
import { Selection } from "./selection";

import './flow-list.css';
import { THEME } from '../../const';

interface Props {
    flows: Flow[];
    selection: Selection;

    onSelectFlow: (selection: Selection) => void;
    onCreateFlow: () => void;
    onRemoveFlow: (flowKey: FlowKey) => void;
    onAssignPlayer: (flowKey: FlowKey) => void;
    onRemovePlayer: (flowKey: FlowKey) => void;
}

export const FlowList = SortableContainer<Props>((props: Props) => {
    const { flows, selection, onSelectFlow, onCreateFlow, onRemoveFlow, onAssignPlayer, onRemovePlayer } = props;
    const fg400 = useForeground(THEME.grey[400]);

    return <div className="flow-list" style={{backgroundColor: THEME.grey[500]}}>
        <div className="flow-list__header" style={{backgroundColor: THEME.grey[400]}}>
            <span style={{color: fg400}}>Flows</span>
            <Icon size={24} color={fg400} path={mdiPlus} onClick={onCreateFlow} />
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

