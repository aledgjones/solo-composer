import React, { FC } from "react";
import { mdiPlus } from "@mdi/js";

import { Icon, SortableContainer } from "solo-ui";

import { PlayerKey } from "../../../services/player";
import { useAppActions, useAppState } from "../../../services/state";
import { PlayerItem } from "../player-item";
import { Selection } from "../selection";
import { useCounts } from "../../../services/instrument";

import "./styles.css";

interface Props {
    selection: Selection;

    onSelectPlayer: (selection: Selection) => void;
    onAddInstrument: (playerKey: PlayerKey) => void;
    onRemovePlayer: (playerKey: PlayerKey) => void;
    onCreatePlayer: () => void;
}

export const PlayerList: FC<Props> = ({ selection, onSelectPlayer, onAddInstrument, onRemovePlayer, onCreatePlayer }) => {
    const actions = useAppActions();
    const counts = useCounts();
    const { theme, players, instruments, expanded } = useAppState(s => {
        return {
            theme: s.ui.theme.pallets,
            players: s.score.players.order.map(key => {
                return s.score.players.byKey[key];
            }),
            instruments: s.score.instruments,
            expanded: s.ui.expanded
        };
    });

    return (
        <div className="player-list" style={{ backgroundColor: theme.background[500].bg }}>
            <div className="player-list__header" style={{ backgroundColor: theme.background[400].bg, borderLeft: `1px solid ${theme.background[500].bg}` }}>
                <span className="player-list__label" style={{ color: theme.background[400].fg }}>
                    Players
                </span>
                <Icon size={24} color={theme.background[400].fg} path={mdiPlus} onClick={onCreatePlayer} />
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
