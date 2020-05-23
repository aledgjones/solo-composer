import React, {
    useCallback,
    useMemo,
    MouseEvent,
    FC,
    useRef,
    CSSProperties,
    useState
} from "react";
import { mdiDeleteOutline, mdiFileDocumentOutline, mdiPencilOutline } from "@mdi/js";
import { Icon, Checkbox, merge, SortableItem } from "solo-ui";

import { Flow } from "../../../services/score-flow";
import { useAppState, useAppActions } from "../../../services/state";
import { SelectionType, Selection } from "../selection";

import "./styles.css";

interface Props {
    index: number;
    flow: Flow;
    selection: Selection;
    style: CSSProperties;

    onSelect: (selection: Selection) => void;
}

export const FlowItem: FC<Props> = ({ index, flow, selection, style, onSelect }) => {
    const handle = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLInputElement>(null);
    const actions = useAppActions();
    const theme = useAppState((s) => s.app.theme.pallets);

    const [editing, setEditing] = useState(false);

    const selected: boolean = useMemo(() => {
        return !!selection && selection.key === flow.key;
    }, [selection, flow.key]);

    const active: boolean = useMemo(() => {
        return (
            !!selection &&
            selection.type === SelectionType.player &&
            flow.players.includes(selection.key)
        );
    }, [selection, flow.players]);

    const onSelectFlow = useCallback(() => {
        onSelect({ key: flow.key, type: SelectionType.flow });
    }, [flow.key, onSelect]);

    const onCheckboxChange = useCallback(
        (value: boolean) => {
            if (selection) {
                if (value) {
                    const playerKey = selection.key;
                    actions.score.flows.assignPlayer(flow.key, playerKey);
                } else {
                    const playerKey = selection.key;
                    actions.score.flows.removePlayer(flow.key, playerKey);
                }
            }
        },
        [selection, flow.key, actions.score.flows]
    );

    const onRemove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            actions.score.flows.remove(flow.key);
            onSelect(null);
        },
        [onSelect, actions.score.flows, flow.key]
    );

    const onEdit = useCallback(() => {
        if (input.current) {
            input.current.focus();
        }
        setEditing(true);
    }, [input]);

    const onBlur = useCallback(() => {
        setEditing(false);
        if (!flow.title) {
            actions.score.flows.rename(flow.key, "Untitled Flow");
        }
    }, [flow.title, actions.score.flows, flow.key]);

    const { bg, fg } = useMemo(() => {
        if (editing) {
            return theme.primary[600];
        } else if (selected) {
            return theme.primary[500];
        } else if (active) {
            return theme.background[700];
        } else {
            return theme.background[600];
        }
    }, [editing, selected, active, theme]);

    return (
        <SortableItem
            index={index}
            handle={handle}
            className={merge("flow-item", { "flow-item--selected": selected })}
            style={{ backgroundColor: bg, color: fg, ...style }}
            onClick={onSelectFlow}
        >
            <div className="flow-item__header">
                <div onPointerDown={onSelectFlow} ref={handle}>
                    <Icon
                        style={{ marginRight: 12 }}
                        path={mdiFileDocumentOutline}
                        size={24}
                        color={fg}
                    />
                </div>

                <input
                    ref={input}
                    onBlur={onBlur}
                    readOnly={!editing}
                    className="flow-item__name"
                    value={flow.title}
                    style={{ color: fg }}
                    onInput={(e: any) => actions.score.flows.rename(flow.key, e.target.value)}
                />

                {selected && (
                    <>
                        <Icon
                            style={{ marginLeft: 12 }}
                            size={24}
                            color={fg}
                            path={mdiPencilOutline}
                            onClick={onEdit}
                        />
                        <Icon
                            style={{ marginLeft: 12 }}
                            size={24}
                            color={fg}
                            path={mdiDeleteOutline}
                            onClick={onRemove}
                        />
                    </>
                )}

                {!!selection && selection.type !== SelectionType.flow && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox color="white" value={active} onChange={onCheckboxChange} />
                    </div>
                )}
            </div>
        </SortableItem>
    );
};
