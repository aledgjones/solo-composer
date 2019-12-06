import React, { useCallback, useMemo, MouseEvent } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { mdiDeleteOutline, mdiFileDocumentBoxOutline } from '@mdi/js';

import { Theme } from '../../const';
import Color from 'color';

import { Flow, FlowKey } from '../../services/flow';

import { Icon, Checkbox } from '../../ui';
import { Handle } from './handle';
import { SelectionType, Selection } from '.';

import './flow-item.css';

interface Props {
    flow: Flow;
    selection: Selection;

    onSelectFlow: (key: string, type: SelectionType) => void;
    onRemoveFlow: (flow: Flow) => void;
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

    const onSelect = useCallback(() => onSelectFlow(flow.key, SelectionType.flow), [flow.key, onSelectFlow]);
    const onCheckboxChange = useCallback((value: boolean) => {
        if (value) {
            onAssignPlayer(flow.key);
        } else {
            onRemovePlayer(flow.key);
        }
    }, [flow.key, onRemovePlayer, onAssignPlayer]);

    const onRemove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onRemoveFlow(flow);
    }, [onRemoveFlow, flow]);

    const bg = useMemo(() => {
        if (selected) {
            return Theme.primary;
        } else if (active) {
            return '#293237';
        } else {
            return '#232c32';
        }
    }, [selected, active]);

    const fg = useMemo(() => {
        return Color(bg).isDark() ? '#ffffff' : '#000000';
    }, [bg]);

    return <div className="flow-item" style={{ backgroundColor: bg, color: fg }} onClick={onSelect}>
        <div className="flow-item__header">
            <Handle>
                <Icon style={{ marginRight: 16 }} path={mdiFileDocumentBoxOutline} size={24} color={fg} />
            </Handle>
            <span className="flow-item__name">{flow.title}</span>
            {selected && <>
                <Icon style={{ marginLeft: 12 }} size={24} color={fg} path={mdiDeleteOutline} onClick={onRemove} />
            </>}
            {!!selection && selection.type !== SelectionType.flow && <Checkbox color="white" value={active} onChange={onCheckboxChange} />}
        </div>
    </div>;
});