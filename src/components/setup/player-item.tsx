import React, { useCallback, useState, useMemo, MouseEvent } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { mdiChevronDown, mdiPlus, mdiDeleteOutline, mdiChevronUp } from '@mdi/js';
import Color from 'color';

import { Icon } from '../../ui';
import { Player, PlayerType, usePlayerName, usePlayerIcon } from '../../services/player';
import { Instruments, InstrumentCounts } from '../../services/instrument';
import { Theme } from '../../const';
import { InstrumentItem } from './instrument-item';
import { Handle } from './handle';
import { SelectionType } from '.';

import './player-item.css';
import { Text } from '../shared/text';

interface Props {
    player: Player;
    instruments: Instruments;
    counts: InstrumentCounts;
    selected: boolean;

    onSelectPlayer: (key: string, type: SelectionType) => void;
    onAddInstrument: (key: string) => void;
    onRemovePlayer: (player: Player) => void;
}

export const PlayerItem = SortableElement<Props>((props: Props) => {

    const { player, instruments, counts, selected, onSelectPlayer, onAddInstrument, onRemovePlayer } = props;

    const [expanded, setExpanded] = useState<boolean>(false);
    const onExpand = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setExpanded(value => !value);
    }, []);

    const onSelect = useCallback(() => onSelectPlayer(player.key, SelectionType.player), [player.key, onSelectPlayer]);

    const onRemove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onRemovePlayer(player);
    }, [onRemovePlayer, player]);

    const bg = useMemo(() => {
        if (selected) {
            return Theme.primary;
        } else {
            return undefined;
        }
    }, [selected]);

    const fg = useMemo(() => {
        return Color(bg).isDark() ? '#ffffff' : '#000000';
    }, [bg]);

    const name = usePlayerName(player, instruments, counts);
    const icon = usePlayerIcon(player);

    return <div className="player-item" style={{ backgroundColor: bg, color: fg }} onClick={onSelect}>
        <div className="player-item__header">
            <Handle>
                <Icon style={{ marginRight: 16 }} path={icon} size={24} color={fg} />
            </Handle>

            <Text style={{whiteSpace: 'pre'}} className="player-item__name">{name}</Text>

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