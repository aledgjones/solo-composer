import React, { useCallback, useMemo, MouseEvent, FC, useRef } from 'react';
import { mdiChevronDown, mdiPlus, mdiDeleteOutline, mdiChevronUp } from '@mdi/js';

import { Icon, useForeground, merge } from 'solo-ui';
import { SortableItem } from '../../components/sortable-item';

import { Player, PlayerType, usePlayerName, usePlayerIcon, PlayerKey } from '../../services/player';
import { Instruments } from '../../services/instrument';
import { InstrumentCounts } from '../../services/instrument-utils';
import { THEME } from '../../const';
import { InstrumentItem } from './instrument-item';
import { SelectionType, Selection } from "./selection";
import { Text } from '../../components/text';

import './player-item.css';

interface Props {
    index: number;
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

export const PlayerItem: FC<Props> = ({ index, player, instruments, counts, selected, expanded, onSelectPlayer, onToggleExpandPlayer, onAddInstrument, onRemovePlayer }) => {

    const handle = useRef<HTMLDivElement>(null);

    const onExpand = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onToggleExpandPlayer(player.key + '-setup');
    }, [onToggleExpandPlayer, player.key]);

    const onSelect = useCallback(() => onSelectPlayer({ key: player.key, type: SelectionType.player }), [player.key, onSelectPlayer]);

    const onRemove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onRemovePlayer(player.key);
    }, [onRemovePlayer, player.key]);

    const bg = useMemo(() => {
        if (selected) {
            return THEME.primary[500];
        } else {
            return THEME.grey[600];
        }
    }, [selected]);

    const fg = useForeground(bg);

    const name = usePlayerName(player, instruments, counts);
    const icon = usePlayerIcon(player);

    return <SortableItem index={index} handle={handle} className={merge("player-item", { 'player-item--selected': selected })} style={{ backgroundColor: bg, color: fg }} onClick={onSelect}>
        <div className="player-item__header">

            <div onPointerDown={onSelect} ref={handle}>
                <Icon style={{ marginRight: 16 }} path={icon} size={24} color={fg} />
            </div>

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
    </SortableItem>;
};