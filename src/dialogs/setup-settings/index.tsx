import React, { useState } from "react";
import { Select, Option, Button, Subheader, Label, Dialog } from "solo-ui";

import { useAppActions, useAppState } from "../../services/state";
import { MenuItem } from "../../components/menu-item";
import { InstrumentAutoCountStyle } from "../../services/score-instrument-utils";

import "../generic-settings.css";

enum Page {
    StaveLabels = 1
}

interface Props {
    onClose: () => void;
}

export const SetupSettings = Dialog<Props>(({ onClose }) => {

    const [page, setPage] = useState<Page>(Page.StaveLabels);

    const actions = useAppActions();
    const { theme, config } = useAppState(s => {
        return {
            theme: s.app.theme.pallets,
            config: s.score.config
        }
    });

    return (
        <div className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <MenuItem color={theme.primary[500].bg} selected={page === Page.StaveLabels} onClick={() => setPage(Page.StaveLabels)}>
                        Numbering
                    </MenuItem>
                </div>

                <div className="generic-settings__right-panel">
                    {page === Page.StaveLabels && (
                        <>
                            <div
                                className="generic-settings__section"
                                style={{ paddingBottom: 20 }}
                            >
                                <Subheader>instrument numbering</Subheader>
                                <Select
                                    margin
                                    color={theme.primary[500].bg}
                                    label="Style for solo players"
                                    value={config.autoCountStyleSolo}
                                    onChange={(val: InstrumentAutoCountStyle) => actions.score.config.set({ autoCountStyleSolo: val })}
                                >
                                    <Option value={InstrumentAutoCountStyle.arabic} displayAs="Arabic">
                                        <Label>
                                            <p>Arabic</p>
                                            <p>1, 2, 3...</p>
                                        </Label>
                                    </Option>
                                    <Option value={InstrumentAutoCountStyle.roman} displayAs="Roman">
                                        <Label>
                                            <p>Roman</p>
                                            <p>I, II, III...</p>
                                        </Label>
                                    </Option>
                                </Select>
                                <Select
                                    className="ui-select--margin"
                                    color={theme.primary[500].bg}
                                    label="Style for section players"
                                    value={config.autoCountStyleSection}
                                    onChange={(val: InstrumentAutoCountStyle) => actions.score.config.set({ autoCountStyleSection: val })}
                                >
                                    <Option value={InstrumentAutoCountStyle.arabic} displayAs="Arabic">
                                        <Label>
                                            <p>Arabic</p>
                                            <p>1, 2, 3...</p>
                                        </Label>
                                    </Option>
                                    <Option value={InstrumentAutoCountStyle.roman} displayAs="Roman">
                                        <Label>
                                            <p>Roman</p>
                                            <p>I, II, III...</p>
                                        </Label>
                                    </Option>
                                </Select>
                            </div>
                        </>
                    )}

                </div>
            </div>

            <div className="generic-settings__buttons">
                <Button compact color={theme.primary[500].bg} outline>
                    Reset All
                </Button>
                <div className="generic-settings__spacer" />
                <Button compact color={theme.primary[500].bg} onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
});
