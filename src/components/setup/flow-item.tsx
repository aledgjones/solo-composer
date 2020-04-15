import React, { useCallback, useMemo, MouseEvent } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { mdiDeleteOutline, mdiFileDocumentOutline } from '@mdi/js';

import { THEME } from '../../const';

import { Flow, FlowKey } from '../../services/flow';

import { Icon, Checkbox } from 'solo-ui';
import { Handle } from './handle';
import { SelectionType, Selection } from "./selection";

import './flow-item.css';

interface Props {
    flow: Flow;
    selection: Selection;

    onSelectFlow: (selection: Selection) => void;
    onRemoveFlow: (flowKey: FlowKey) => void;
    onAssignPlayer: (flowKey: FlowKey) => void;
    onRemovePlayer: (flowKey: FlowKey) => void;
}

export const FlowItem = SortableElement<Props>((props: Props) => {

    const { flow, selection, onSelectFlow, onRemoveFlow, onAssignPlayer, onRemovePlayer } = props;

    const selected: boolean = useMemo(() => {
        return !!selection && selection.key === flow.key;
    }, [selection, flow.key]);

    const active: boolean = useMemo(() => {
        return !!selection && selection.type === SelectionType.player && flow.players.includes(selection.key);
    }, [selection, flow.players]);

    const onSelect = useCallback(() => onSelectFlow({ key: flow.key, type: SelectionType.flow }), [flow.key, onSelectFlow]);
    const onCheckboxChange = useCallback((value: boolean) => {
        if (value) {
            onAssignPlayer(flow.key);
        } else {
            onRemovePlayer(flow.key);
        }
    }, [flow.key, onRemovePlayer, onAssignPlayer]);

    const onRemove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onRemoveFlow(flow.key);
    }, [onRemoveFlow, flow.key]);

    const { bg, fg } = useMemo(() => {
        if (selected) {
            return THEME.primary[500];
        } else if (active) {
            return THEME.grey[700];
        } else {
            return THEME.grey[600];
        }
    }, [selected, active]);

    return <div className="flow-item" style={{ backgroundColor: bg, color: fg }} onClick={onSelect}>
        <div className="flow-item__header">
            <Handle>
                <Icon style={{ marginRight: 16 }} path={mdiFileDocumentOutline} size={24} color={fg} />
            </Handle>
            <span className="flow-item__name">{flow.title}</span>
            {selected && <>
                <Icon style={{ marginLeft: 12 }} size={24} color={fg} path={mdiDeleteOutline} onClick={onRemove} />
            </>}
            {!!selection && selection.type !== SelectionType.flow && <Checkbox color="white" value={active} onChange={onCheckboxChange} />}
        </div>
    </div>;
});