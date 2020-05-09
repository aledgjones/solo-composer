import React, { useState } from "react";
import { Button, Subheader, Switch, ListItem, Label, Select, Option, Dialog } from "solo-ui";

import { ThemeMode, ThemeColor } from "../../services/theme";
import { useAppActions, useAppState } from "../../services/state";
import { MenuItem } from "../../components/menu-item";

import "../generic-settings.css";

enum Page {
    general = 1,
    noteInput
}

interface Props {
    onClose: () => void;
}

export const Preferences = Dialog<Props>(({ onClose }) => {
    const actions = useAppActions();
    const { theme, audition } = useAppState(s => {
        return {
            theme: s.ui.theme,
            audition: s.playback.settings.audition
        };
    });

    const [page, setPage] = useState<Page>(Page.general);

    return (
        <div className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <MenuItem highlight={theme.pallets.primary[500]} selected={page === Page.general} onClick={() => setPage(Page.general)}>
                        General
                    </MenuItem>
                    <MenuItem highlight={theme.pallets.primary[500]} selected={page === Page.noteInput} onClick={() => setPage(Page.noteInput)}                    >
                        Note Input &amp; Editing
                    </MenuItem>
                </div>

                <div className="generic-settings__right-panel">
                    {page === Page.general && (
                        <>
                            <div className="generic-settings__section">
                                <Subheader>General</Subheader>
                                <Select label="Language" color={theme.pallets.primary[500].bg} value="en-gb" onChange={() => { }}                                >
                                    <Option value="en-gb" displayAs="English (UK)">
                                        English (UK)
                                    </Option>
                                </Select>
                            </div>
                            <div className="generic-settings__section">
                                <Subheader>THEME</Subheader>
                                <Select margin label="Mode" color={theme.pallets.primary[500].bg} value={theme.mode} onChange={(mode: ThemeMode) => actions.ui.theme.mode(mode)}>
                                    <Option value={ThemeMode.light} displayAs="Light">
                                        Light
                                    </Option>
                                    <Option value={ThemeMode.dark} displayAs="Dark">
                                        Dark
                                    </Option>
                                </Select>
                                <Select margin label="Accent colour" color={theme.pallets.primary[500].bg} value={theme.primary} onChange={(color: ThemeColor) => actions.ui.theme.primary(color)}>
                                    <Option value={ThemeColor.blue} displayAs="Blue">
                                        Blue
                                    </Option>
                                    <Option value={ThemeColor.purple} displayAs="Purple">
                                        Purple
                                    </Option>
                                    <Option value={ThemeColor.green} displayAs="Green">
                                        Green
                                    </Option>
                                    <Option value={ThemeColor.brown} displayAs="Brown">
                                        Brown
                                    </Option>
                                    <Option value={ThemeColor.orange} displayAs="Orange">
                                        Orange
                                    </Option>
                                </Select>

                            </div>
                        </>
                    )}

                    {page === Page.noteInput && (
                        <>
                            <div className="generic-settings__section" style={{ paddingBottom: 0 }}>
                                <Subheader>Auditioning</Subheader>
                            </div>
                            <ListItem onClick={actions.playback.settings.audition.toggle}>
                                <Label>
                                    <p>Enable auditioning</p>
                                    <p>Play notes during note input and selection</p>
                                </Label>
                                <Switch color={theme.pallets.primary[500].bg} value={audition} />
                            </ListItem>
                        </>
                    )}
                </div>
            </div >

            <div className="generic-settings__buttons">
                <div className="generic-settings__spacer" />
                <Button compact color={theme.pallets.primary[500].bg} onClick={onClose}>
                    Close
                </Button>
            </div>
        </div >
    );
});
