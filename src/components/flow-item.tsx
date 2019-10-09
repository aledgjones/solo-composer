import React, { useCallback, useMemo } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { mdiDeleteOutline, mdiFileDocumentBoxOutline, mdiPencilOutline } from '@mdi/js';
import Color from 'color';

import { Icon } from '../ui';
import { Flow } from '../services/flow';
import { THEME } from '../const';
import { Handle } from './handle';

import './flow-item.css';

interface Props {
    flow: Flow;
    selected: boolean;

    onSelect: (key: string) => void;
    onRemoveFlow: (flow: Flow) => void;
}

export const FlowItem = SortableElement<Props>((props: Props) => {

    const { flow, selected, onSelect, onRemoveFlow } = props;

    const _onSelect = useCallback(() => onSelect(flow.key), [flow.key, onSelect]);

    const bg = useMemo(() => {
        if (selected) {
            return THEME.PRIMARY;
        } else {
            return undefined;
        }
    }, [selected]);

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
        </div>
    </div>;
});