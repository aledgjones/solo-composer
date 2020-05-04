import React, { FC, useState } from 'react';
import { Button, Subheader, Switch, ListItem, Label, Select, Option } from 'solo-ui';

import { THEME } from '../../const';
import { useAppActions, useAppState } from '../../services/state';
import { MenuItem } from '../../components/menu-item';

import '../generic-settings.css';

enum Page {
    general = 1,
    noteInput
}

interface Props {
    onClose: () => void;
}

export const Preferences: FC<Props> = ({ onClose }) => {

    const actions = useAppActions();
    const { audition } = useAppState(s => {
        return {
            audition: s.playback.settings.audition
        }
    });

    const [page, setPage] = useState<Page>(Page.general);
    const bg = THEME.primary[500];

    return <div className="generic-settings">
        <div className="generic-settings__content">

            <div className="generic-settings__left-panel">
                <MenuItem selected={page === Page.general} onClick={() => setPage(Page.general)}>General</MenuItem>
                <MenuItem selected={page === Page.noteInput} onClick={() => setPage(Page.noteInput)}>Note Input &amp; Editing</MenuItem>
            </div>

            <div className="generic-settings__right-panel">

                {page === Page.general && <>

                    <div className="generic-settings__section" style={{ paddingBottom: 0 }}>
                        <Subheader>General</Subheader>
                        <Select label="Language" color={bg} value="en-gb" onChange={() => { }}>
                            <Option value="en-gb" displayAs="English (UK)">English (UK)</Option>
                        </Select>
                    </div>

                </>}

                {page === Page.noteInput && <>

                    <div className="generic-settings__section" style={{ paddingBottom: 0 }}>
                        <Subheader>Auditioning</Subheader>
                    </div>
                    <ListItem onClick={actions.playback.settings.audition.toggle}>
                        <Label>
                            <p>Enable auditioning</p>
                            <p>Play notes during note input and selection</p>
                        </Label>
                        <Switch color={THEME.primary[500]} value={audition} />
                    </ListItem>

                </>}



            </div>
        </div>

        <div className="generic-settings__buttons">
            <div className="generic-settings__spacer" />
            <Button compact color={bg} onClick={onClose}>Close</Button>
        </div>
    </div>
}