import React, { FC } from "react";
import { mdiPlus } from "@mdi/js";

import { Icon, SortableContainer } from "solo-ui";

import { THEME } from "../../const";
import { useAppActions, useAppState } from "../../services/state";
import { FlowKey } from "../../services/flow";
import { FlowItem } from "./flow-item";
import { Selection } from "./selection";

import "./flow-list.css";

interface Props {
    selection: Selection;

    onSelectFlow: (selection: Selection) => void;
    onCreateFlow: () => void;
    onRemoveFlow: (flowKey: FlowKey) => void;
    onAssignPlayer: (flowKey: FlowKey) => void;
    onRemovePlayer: (flowKey: FlowKey) => void;
}

export const FlowList: FC<Props> = ({
    selection,
    onSelectFlow,
    onCreateFlow,
    onRemoveFlow,
    onAssignPlayer,
    onRemovePlayer
}) => {
    const actions = useAppActions();
    const { flows } = useAppState(s => {
        return {
            flows: s.score.flows.order.map(key => {
                return s.score.flows.byKey[key];
            })
        };
    });

    return (
        <div className="flow-list" style={{ backgroundColor: THEME.grey[500].backgroundColor }}>
            <div className="flow-list__header" style={{ backgroundColor: THEME.grey[400].backgroundColor }}>
                <span style={{ color: THEME.grey[400].color }}>Flows</span>
                <Icon size={24} color={THEME.grey[400].color} path={mdiPlus} onClick={onCreateFlow} />
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
