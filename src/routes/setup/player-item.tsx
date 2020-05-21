import React, { useCallback, useMemo, MouseEvent, FC, useRef } from "react";
import { mdiChevronDown, mdiPlus, mdiDeleteOutline, mdiChevronUp } from "@mdi/js";
import { Icon, merge, SortableContainer, SortableItem } from "solo-ui";

import { useAppActions, useAppState } from "../../services/state";
import { Player, PlayerType, usePlayerName, usePlayerIcon, PlayerKey } from "../../services/player";
import { Instruments } from "../../services/instrument";
import { InstrumentCounts } from "../../services/instrument-utils";
import { InstrumentItem } from "./instrument-item";
import { SelectionType, Selection } from "./selection";
import { Text } from "../../components/text";

import "./player-item.css";

interface Props {
    index: number;
    player: Player;
    instruments: Instruments;
    counts: InstrumentCounts;
    selected: boolean;
    expanded: boolean;

    onSelect: (selection: Selection) => void;
    onAddInstrument: (playerKey: PlayerKey) => void;
}

export const PlayerItem: FC<Props> = ({
    index,
    player,
    instruments,
    counts,
    selected,
    expanded,
    onSelect,
    onAddInstrument
}) => {
    const handle = useRef<HTMLDivElement>(null);
    const actions = useAppActions();
    const theme = useAppState((s) => s.ui.theme.pallets);

    const onExpand = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            actions.ui.expanded.toggle(player.key + "-setup");
        },
        [actions.ui.expanded, player.key]
    );

    const onSelectPlayer = useCallback(
        () => {
            onSelect({ key: player.key, type: SelectionType.player })
        },
        [player.key, onSelect]
    );

    const onRemove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            actions.score.players.remove(player.key);
            onSelect(null);
        },
        [onSelect, actions.score.players, player.key]
    );

    const { bg, fg } = useMemo(() => {
        if (selected) {
            return theme.primary[500];
        } else {
            return theme.background[600];
        }
    }, [selected, theme]);

    const name = usePlayerName(player, instruments, counts);
    const icon = usePlayerIcon(player);

    return (
        <SortableItem
            index={index}
            handle={handle}
            className={merge("player-item", {
                "player-item--selected": selected
            })}
            style={{ backgroundColor: bg, color: fg }}
            onClick={onSelectPlayer}
        >
            <div className="player-item__header">
                <div onPointerDown={onSelectPlayer} ref={handle}>
                    <Icon style={{ marginRight: 16 }} path={icon} size={24} color={fg} />
                </div>

                <Text style={{ whiteSpace: "pre" }} className="player-item__name">
                    {name}
                </Text>

                {selected && (
                    <>
                        <Icon
                            style={{ marginLeft: 12 }}
                            size={24}
                            color={fg}
                            path={mdiDeleteOutline}
                            onClick={onRemove}
                        />
                        {(player.instruments.length === 0 || player.type === PlayerType.solo) && (
                            <Icon
                                style={{ marginLeft: 12 }}
                                path={mdiPlus}
                                size={24}
                                color={fg}
                                onClick={() => onAddInstrument(player.key)}
                            />
                        )}
                    </>
                )}
                <Icon
                    style={{ marginLeft: 12 }}
                    path={expanded ? mdiChevronUp : mdiChevronDown}
                    size={24}
                    color={fg}
                    onClick={onExpand}
                />
            </div>
            {expanded && (
                <SortableContainer
                    direction="y"
                    className="player-item__list"
                    onEnd={(oldIndex: number, newIndex: number) => {
                        actions.score.instruments.reorder(player.key, oldIndex, newIndex);
                    }}
                >
                    {player.instruments.map((key, i) => {
                        return (
                            <InstrumentItem
                                key={key}
                                index={i}
                                onSelect={onSelectPlayer}
                                selected={selected}
                                instrument={instruments[key]}
                                count={counts[key]}
                            />
                        );
                    })}
                </SortableContainer>
            )}
        </SortableItem>
    );
};
