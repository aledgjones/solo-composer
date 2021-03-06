import React, { useState } from "react";
import { Button, Subheader, Switch, ListItem, Label, Select, Option, Dialog } from "solo-ui";

import { ThemeMode } from "../../services/app-theme";
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
    const { theme, audition } = useAppState((s) => {
        return {
            theme: s.app.theme,
            audition: s.app.audition
        };
    });

    const [page, setPage] = useState<Page>(Page.general);

    return (
        <div className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <MenuItem
                        color={theme.pallets.primary[500].bg}
                        selected={page === Page.general}
                        onClick={() => setPage(Page.general)}
                    >
                        General
                    </MenuItem>
                    <MenuItem
                        color={theme.pallets.primary[500].bg}
                        selected={page === Page.noteInput}
                        onClick={() => setPage(Page.noteInput)}
                    >
                        Note Input &amp; Editing
                    </MenuItem>
                </div>

                <div className="generic-settings__right-panel">
                    {page === Page.general && (
                        <>
                            <div className="generic-settings__section">
                                <Subheader>General</Subheader>
                                <Select
                                    label="Language"
                                    color={theme.pallets.primary[500].bg}
                                    value="en-gb"
                                    onChange={() => { }}
                                >
                                    <Option value="en-gb" displayAs="English (UK)">
                                        English (UK)
                                    </Option>
                                </Select>
                            </div>
                            <div className="generic-settings__section">
                                <Subheader>THEME</Subheader>
                                <Select
                                    margin
                                    label="Mode"
                                    color={theme.pallets.primary[500].bg}
                                    value={theme.mode}
                                    onChange={(mode: ThemeMode) => actions.app.theme.mode(mode)}
                                >
                                    <Option value={ThemeMode.auto} displayAs="Auto">
                                        <Label>
                                            <p>Auto</p>
                                            <p>Use the system preference if available</p>
                                        </Label>
                                    </Option>
                                    <Option value={ThemeMode.light} displayAs="Light">
                                        Light
                                    </Option>
                                    <Option value={ThemeMode.dark} displayAs="Dark">
                                        Dark
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
                            <ListItem onClick={actions.app.audition.toggle}>
                                <Label>
                                    <p>Enable auditioning</p>
                                    <p>Play notes during note input and selection</p>
                                </Label>
                                <Switch color={theme.pallets.primary[500].bg} value={audition} />
                            </ListItem>
                        </>
                    )}
                </div>
            </div>

            <div className="generic-settings__buttons">
                <div className="generic-settings__spacer" />
                <Button compact color={theme.pallets.primary[500].bg} onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
});
