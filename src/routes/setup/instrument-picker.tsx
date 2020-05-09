import React, { useState } from "react";
import { mdiChevronRight } from "@mdi/js";
import { Icon, Button, Dialog } from "solo-ui";

import { useAppState } from "../../services/state";
import { InstrumentDef, useInstrumentList, getFirstInstrumentDefFromPartialPath } from "../../services/instrument-defs";
import { MenuItem } from "../../components/menu-item";

import "./instrument-picker.css";

interface Props {
    onSelect: (def: InstrumentDef) => void;
    onCancel: () => void;
}

export const InstrumentPicker = Dialog<Props>(({ onSelect, onCancel }) => {
    const theme = useAppState(s => s.ui.theme.pallets);
    const [selection, setSelection] = useState<InstrumentDef>(getFirstInstrumentDefFromPartialPath([]));
    const lists = useInstrumentList(selection);

    return (
        <div className="instrument-picker">
            <div className="instrument-picker__sections">
                {lists.map((list, i) => {
                    return (
                        <div key={i} className="instrument-picker__section">
                            {list.map(item => {
                                const selected = item === selection.path[i];
                                const final = !(
                                    selected &&
                                    lists[i + 1] &&
                                    lists[i + 1].length > 0
                                );

                                return (
                                    <MenuItem
                                        key={item}
                                        highlight={theme.primary[500]}
                                        selected={selected}
                                        onClick={() => {
                                            const path = [...selection.path.slice(0, i), item];
                                            const def = getFirstInstrumentDefFromPartialPath(path);
                                            setSelection(def);
                                        }}
                                    >
                                        <span>{item}</span>
                                        {!final && (
                                            <Icon
                                                color={selected ? theme.primary[500].fg : "black"}
                                                size={24}
                                                path={mdiChevronRight}
                                            />
                                        )}
                                    </MenuItem>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <div className="instrument-picker__buttons">
                <div className="instrument-picker__spacer" />
                <Button compact outline style={{ marginRight: 8 }} color={theme.primary[500].bg} onClick={onCancel}>
                    Cancel
                </Button>
                <Button compact color={theme.primary[500].bg} onClick={() => onSelect(selection)}>
                    Add
                </Button>
            </div>
        </div>
    );
});
