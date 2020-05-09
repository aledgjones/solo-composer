import React, { FC } from "react";
import { mdiPlus } from "@mdi/js";

import { Icon, SortableContainer } from "solo-ui";

import { useAppActions, useAppState } from "../../../services/state";
import { FlowKey } from "../../../services/flow";
import { FlowItem } from "../flow-item";
import { Selection } from "../selection";

import "./styles.css";

interface Props {
    selection: Selection;

    onSelectFlow: (selection: Selection) => void;
    onCreateFlow: () => void;
    onRemoveFlow: (flowKey: FlowKey) => void;
    onAssignPlayer: (flowKey: FlowKey) => void;
    onRemovePlayer: (flowKey: FlowKey) => void;
}

export const FlowList: FC<Props> = ({ selection, onSelectFlow, onCreateFlow, onRemoveFlow, onAssignPlayer, onRemovePlayer }) => {

    const actions = useAppActions();
    const { theme, flows } = useAppState(s => {
        return {
            theme: s.ui.theme.pallets,
            flows: s.score.flows.order.map(key => {
                return s.score.flows.byKey[key];
            })
        };
    });

    return (
        <div className="flow-list" style={{ backgroundColor: theme.background[500].bg }}>
            <div className="flow-list__header" style={{ backgroundColor: theme.background[400].bg }}>
                <span style={{ color: theme.background[400].fg }}>Flows</span>
                <Icon size={24} color={theme.background[400].fg} path={mdiPlus} onClick={onCreateFlow} />
            </div>
            <div className="flow-list__wrapper">
                <SortableContainer direction="x" className="flow-list__content" onEnd={actions.score.flows.reorder}>
                    {flows.map((flow, i) => (
                        <FlowItem
                            index={i}
                            key={flow.key}
                            flow={flow}
                            selection={selection}
                            onSelectFlow={onSelectFlow}
                            onRemoveFlow={onRemoveFlow}
                            onAssignPlayer={onAssignPlayer}
                            onRemovePlayer={onRemovePlayer}
                        />
                    ))}
                </SortableContainer>
            </div>
        </div>
    );
};
