import React, { useCallback, useMemo } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { mdiDeleteOutline, mdiFileDocumentBoxOutline } from '@mdi/js';
import Color from 'color';

import { Icon, Checkbox } from '../ui';
import { Flow } from '../services/flow';
import { THEME } from '../const';
import { Handle } from './handle';
import { SelectionType, Selection } from '../states/setup';

import './flow-item.css';

interface Props {
    flow: Flow;
    selection: Selection;

    onSelect: (key: string, type: SelectionType) => void;
    onRemoveFlow: (flow: Flow) => void;
}

export const FlowItem = SortableElement<Props>((props: Props) => {

    const { flow, selection, onSelect, onRemoveFlow } = props;

    const selected: boolean = useMemo(() => {
        return !!selection && selection.key === flow.key;
    }, [selection, flow.key]);

    const active: boolean = useMemo(() => {
        return !!selection && selection.type === SelectionType.player && flow.players.includes(selection.key);
    }, [selection, flow.key, flow.players]);

    const _onSelect = useCallback(() => onSelect(flow.key, SelectionType.flow), [flow.key, onSelect]);

    const bg = useMemo(() => {
        if (selected) {
            return THEME.PRIMARY;
        } else if (active) {
            return '#293237';
        } else {
            return '#232c32';
        }
    }, [selected, active]);

    const fg = useMemo(() => {
        return Color(bg).isDark() ? '#ffffff' : '#000000';
    }, [bg]);

    return <div className="flow-item" style={{ backgroundColor: bg, color: fg }} onClick={_onSelect}>
        <div className="flow-item__header">
            <Handle>
                <Icon style={{ marginRight: 16 }} path={mdiFileDocumentBoxOutline} size={24} color={fg} />
            </Handle>
            <span className="flow-item__name">{flow.title}</span>
            {selected && <>
                <Icon style={{ marginLeft: 12 }} size={24} color={fg} path={mdiDeleteOutline} onClick={() => onRemoveFlow(flow)} />
            </>}
            {selection && selection.type !== SelectionType.flow && <Checkbox color="white" value={active} onChange={() => {}} />}
        </div>
    </div>;
});