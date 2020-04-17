import React, { FC, useState } from 'react';
import { mdiChevronRight } from '@mdi/js';

import { Icon, Button, useForeground } from 'solo-ui';

import { THEME } from '../../const';
import { InstrumentDef, useInstrumentList, getFirstInstrumentDefFromPartialPath } from '../../services/instrument-defs';
import { ListItem } from '../shared/list-item';

import './instrument-picker.css';

interface Props {
    onSelect: (def: InstrumentDef) => void;
    onCancel: () => void;
}

export const InstrumentPicker: FC<Props> = ({ onSelect, onCancel }) => {

    const [selection, setSelection] = useState<InstrumentDef>(getFirstInstrumentDefFromPartialPath([]));
    const lists = useInstrumentList(selection);

    const bg = THEME.primary[500];
    const fg = useForeground(bg);

    return <div className="instrument-picker">
        <div className="instrument-picker__sections">
            {lists.map((list, i) => {
                return <div key={i} className="instrument-picker__section">
                    {list.map(item => {

                        const selected = item === selection.path[i];
                        const final = !(selected && lists[i + 1] && lists[i + 1].length > 0);

                        return <ListItem
                            key={item}
                            selected={selected}
                            onClick={() => {
                                const path = [...selection.path.slice(0, i), item];
                                const def = getFirstInstrumentDefFromPartialPath(path);
                                setSelection(def);
                            }}>
                            <span>{item}</span>
                            {!final && <Icon color={selected ? fg : 'black'} size={24} path={mdiChevronRight} />}
                        </ListItem>
                    })}
                </div>
            })}
        </div>
        <div className="instrument-picker__buttons">
            <div className="instrument-picker__spacer" />
            <Button compact outline style={{ marginRight: 8 }} color={bg} onClick={onCancel}>Cancel</Button>
            <Button compact color={bg} onClick={() => onSelect(selection)}>Add</Button>
        </div>
    </div>
}