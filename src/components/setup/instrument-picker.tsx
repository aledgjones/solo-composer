import React, { FC, useState, useMemo } from 'react';
import { mdiChevronRight } from '@mdi/js';
import Color from 'color';

import { InstrumentDef, useInstrumentList, getFirstInstrumentDefFromPartialPath } from '../../services/instrument-defs';
import { Theme } from '../../const';

import { Card, Backdrop, Icon, Button } from '../../ui';
import { ListItem } from '../shared/list-item';

import './instrument-picker.css';

interface Props {
  onSelect: (def: InstrumentDef) => void;
  onCancel: () => void;
}

export const InstrumentPicker: FC<Props> = ({ onSelect, onCancel }) => {

  const [selection, setSelection] = useState<InstrumentDef>(getFirstInstrumentDefFromPartialPath([]));
  const lists = useInstrumentList(selection);

  const bg = Theme.primary;
  const fg = useMemo(() => {
    return Color(bg).isDark() ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
  }, [bg]);

  return <Backdrop visible={true}>
    <Card animate className="instrument-picker">
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
    </Card>
  </Backdrop>;
}