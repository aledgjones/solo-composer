import React, { useCallback, useMemo, MouseEvent, FC, useRef } from 'react';
import { mdiDeleteOutline, mdiFileDocumentOutline } from '@mdi/js';

import { Icon, Checkbox, useForeground } from 'solo-ui';
import { SortableItem } from '../../components/sortable-item';

import { THEME } from '../../const';
import { Flow, FlowKey } from '../../services/flow';
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

export const FlowItem: FC<Props> = ({ flow, selection, onSelectFlow, onRemoveFlow, onAssignPlayer, onRemovePlayer }) => {

    const handle = useRef<HTMLDivElement>(null);

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

    const bg = useMemo(() => {
        if (selected) {
            return THEME.primary[500];
        } else if (active) {
            return THEME.grey[700];
        } else {
            return THEME.grey[600];
        }
    }, [selected, active]);
    const fg = useForeground(bg);

    return <SortableItem handle={handle} className="flow-item" style={{ backgroundColor: bg, color: fg }} onClick={onSelect}>
        <div className="flow-item__header">

            <div onPointerDown={onSelect} ref={handle}>
                <Icon style={{ marginRight: 16 }} path={mdiFileDocumentOutline} size={24} color={fg} />
            </div>

            <span className="flow-item__name">{flow.title}</span>
            {selected && <>
                <Icon style={{ marginLeft: 12 }} size={24} color={fg} path={mdiDeleteOutline} onClick={onRemove} />
            </>}
            {!!selection && selection.type !== SelectionType.flow && <div onClick={e => e.stopPropagation()}>
                <Checkbox color="white" value={active} onChange={onCheckboxChange} />
            </div>}
        </div>
    </SortableItem>;
};