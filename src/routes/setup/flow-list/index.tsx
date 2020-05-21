import React, { FC, useMemo } from "react";
import { mdiPlus } from "@mdi/js";

import { Icon, SortableContainer } from "solo-ui";

import { useAppActions, useAppState } from "../../../services/state";
import { FlowItem } from "../flow-item";
import { Selection, SelectionType } from "../selection";

import "./styles.css";

interface Props {
    selection: Selection;
    onSelect: (selection: Selection) => void;
}

export const FlowList: FC<Props> = ({ selection, onSelect }) => {

    const actions = useAppActions();
    const { theme, flows } = useAppState(s => {
        return {
            theme: s.ui.theme.pallets,
            flows: s.score.flows.order.map(key => {
                return s.score.flows.byKey[key];
            })
        };
    });

    const width = useMemo(() => {
        if (flows.length > 2) {
            return 240;
        } else {
            return `calc(${100 / flows.length}% - 8px)`;
        }
    }, [flows.length]);

    return (
        <div className="flow-list" style={{ backgroundColor: theme.background[500].bg }}>
            <div className="flow-list__header" style={{ backgroundColor: theme.background[400].bg }}>
                <span style={{ color: theme.background[400].fg }}>Flows</span>
                <Icon size={24} color={theme.background[400].fg} path={mdiPlus} onClick={() => {
                    const key = actions.score.flows.create();
                    onSelect({ key, type: SelectionType.flow });
                }} />
            </div>
            <div className="flow-list__wrapper">
                <SortableContainer direction="x" className="flow-list__content" onEnd={actions.score.flows.reorder}>
                    {flows.map((flow, i) => (
                        <FlowItem
                            index={i}
                            key={flow.key}
                            flow={flow}
                            selection={selection}
                            onSelect={onSelect}
                            style={{ width }}
                        />
                    ))}
                </SortableContainer>
            </div>
        </div>
    );
};
