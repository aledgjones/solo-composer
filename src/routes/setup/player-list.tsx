import React, { FC } from "react";
import { mdiPlus } from "@mdi/js";

import { Icon, SortableContainer } from "solo-ui";

import { THEME } from "../../const";
import { PlayerKey } from "../../services/player";
import { useAppActions, useAppState } from "../../services/state";
import { PlayerItem } from "./player-item";
import { Selection } from "./selection";
import { useCounts } from "../../services/instrument";

import "./player-list.css";

interface Props {
    selection: Selection;

    onSelectPlayer: (selection: Selection) => void;
    onAddInstrument: (playerKey: PlayerKey) => void;
    onRemovePlayer: (playerKey: PlayerKey) => void;
    onCreatePlayer: () => void;
}

export const PlayerList: FC<Props> = ({
    selection,
    onSelectPlayer,
    onAddInstrument,
    onRemovePlayer,
    onCreatePlayer
}) => {
    const actions = useAppActions();
    const counts = useCounts();
    const { players, instruments, expanded } = useAppState(s => {
        return {
            players: s.score.players.order.map(key => {
                return s.score.players.byKey[key];
            }),
            instruments: s.score.instruments,
            expanded: s.ui.expanded
        };
    });

    return (
        <div className="player-list" style={{ backgroundColor: THEME.grey[500].backgroundColor }}>
            <div className="player-list__header" style={{ backgroundColor: THEME.grey[400].backgroundColor }}>
                <span className="player-list__label" style={{ color: THEME.grey[400].color }}>
                    Players
                </span>
                <Icon size={24} color={THEME.grey[400].color} path={mdiPlus} onClick={onCreatePlayer} />
            </div>
            <SortableContainer direction="y" className="player-list__content" onEnd={actions.score.players.reorder}>
                {players.map((player, i) => (
                    <PlayerItem
                        index={i}
                        key={player.key}
                        player={player}
                        instruments={instruments}
                        counts={counts}
                        selected={!!(selection && player.key === selection.key)}
                        expanded={expanded[player.key + "-setup"]}
                        onSelectPlayer={onSelectPlayer}
                        onAddInstrument={onAddInstrument}
                        onRemovePlayer={onRemovePlayer}
                    />
                ))}
            </SortableContainer>
        </div>
    );
};
