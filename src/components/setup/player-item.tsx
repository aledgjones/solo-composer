import React, { useCallback, useMemo, MouseEvent } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { mdiChevronDown, mdiPlus, mdiDeleteOutline, mdiChevronUp } from '@mdi/js';

import { Icon } from '../../ui';
import { Player, PlayerType, usePlayerName, usePlayerIcon, PlayerKey } from '../../services/player';
import { Instruments } from '../../services/instrument';
import { InstrumentCounts } from '../../services/instrument-utils';
import { THEME } from '../../const';
import { InstrumentItem } from './instrument-item';
import { Handle } from './handle';
import { SelectionType, Selection } from "./selection";
import { Text } from '../shared/text';

import './player-item.css';

interface Props {
    player: Player;
    instruments: Instruments;
    counts: InstrumentCounts;
    selected: boolean;
    expanded: boolean;

    onSelectPlayer: (selection: Selection) => void;
    onToggleExpandPlayer: (playerKey: PlayerKey) => void;
    onAddInstrument: (playerKey: PlayerKey) => void;
    onRemovePlayer: (playerKey: PlayerKey) => void;
}

export const PlayerItem = SortableElement<Props>((props: Props) => {

    const { player, instruments, counts, selected, expanded, onSelectPlayer, onToggleExpandPlayer, onAddInstrument, onRemovePlayer } = props;

    const onExpand = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onToggleExpandPlayer(player.key);
    }, [onToggleExpandPlayer, player.key]);

    const onSelect = useCallback(() => onSelectPlayer({ key: player.key, type: SelectionType.player }), [player.key, onSelectPlayer]);

    const onRemove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onRemovePlayer(player.key);
    }, [onRemovePlayer, player.key]);

    const { fg, bg } = useMemo(() => {
        if (selected) {
            return THEME.primary[500];
        } else {
            return THEME.grey[600];
        }
    }, [selected]);

    const name = usePlayerName(player, instruments, counts);
    const icon = usePlayerIcon(player);

    return <div className="player-item" style={{ backgroundColor: bg, color: fg }} onClick={onSelect}>
        <div className="player-item__header">
            <Handle>
                <Icon style={{ marginRight: 16 }} path={icon} size={24} color={fg} />
            </Handle>

            <Text style={{ whiteSpace: 'pre' }} className="player-item__name">{name}</Text>

            {selected && <>
                <Icon style={{ marginLeft: 12 }} size={24} color={fg} path={mdiDeleteOutline} onClick={onRemove} />
                {player.type === PlayerType.solo && <Icon style={{ marginLeft: 12 }} path={mdiPlus} size={24} color={fg} onClick={() => onAddInstrument(player.key)} />}
            </>}
            <Icon style={{ marginLeft: 12 }} path={expanded ? mdiChevronUp : mdiChevronDown} size={24} color={fg} onClick={onExpand} />
        </div>
        {expanded && <div className="player-item__list">
            {player.instruments.map(key => {
                return <InstrumentItem key={key} selected={selected} instrument={instruments[key]} count={counts[key]} />
            })}
        </div>}
    </div>;
});