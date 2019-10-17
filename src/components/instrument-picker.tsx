import React, { FC, useState, useMemo } from 'react';
import { mdiChevronRight } from '@mdi/js';
import Color from 'color';

import { InstrumentDef, useInstrumentList, getFirstInstrumentDefFromPartialPath } from '../services/instrument-defs';
import { Theme } from '../const';

import { Card } from '../ui/components/card';
import { Backdrop } from '../ui/components/backdrop';
import { Icon, Button } from '../ui';

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

              return <div
                key={item}
                style={{ color: selected ? fg : undefined, backgroundColor: selected ? bg : undefined }}
                className="instrument-picker__item"
                onClick={() => {
                  const path = [...selection.path.slice(0, i), item];
                  const def = getFirstInstrumentDefFromPartialPath(path);
                  setSelection(def);
                }}
              >
                <span>{item}</span>
                {!final && <Icon color={selected ? fg : 'black'} size={24} path={mdiChevronRight} />}
              </div>
            })}
          </div>
        })}
      </div>
      <div className="instrument-picker__buttons">
        <div className="instrument-picker__spacer" />
        <Button style={{ marginRight: 4 }} color="white" onClick={() => onCancel()}>Cancel</Button>
        <Button color={bg} onClick={() => onSelect(selection)}>Add</Button>
      </div>
    </Card>
  </Backdrop>;
}