import React, { useState } from "react";
import { Button, Subheader, Switch, ListItem, Label, Select, Option, Dialog } from "solo-ui";

import { THEME } from "../../const";
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
    const { audition } = useAppState(s => {
        return {
            audition: s.playback.settings.audition
        };
    });

    const [page, setPage] = useState<Page>(Page.general);
    const color = THEME.primary[500].backgroundColor;

    return (
        <div className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <MenuItem
                        selected={page === Page.general}
                        onClick={() => setPage(Page.general)}
                    >
                        General
                    </MenuItem>
                    <MenuItem
                        selected={page === Page.noteInput}
                        onClick={() => setPage(Page.noteInput)}
                    >
                        Note Input &amp; Editing
                    </MenuItem>
                </div>

                <div className="generic-settings__right-panel">
                    {page === Page.general && (
                        <>
                            <div className="generic-settings__section" style={{ paddingBottom: 0 }}>
                                <Subheader>General</Subheader>
                                <Select
                                    label="Language"
                                    color={color}
                                    value="en-gb"
                                    onChange={() => { }}
                                >
                                    <Option value="en-gb" displayAs="English (UK)">
                                        English (UK)
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
                                <Switch color={color} value={audition} />
                            </ListItem>
                        </>
                    )}
                </div>
            </div>

            <div className="generic-settings__buttons">
                <div className="generic-settings__spacer" />
                <Button compact color={color} onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
});
