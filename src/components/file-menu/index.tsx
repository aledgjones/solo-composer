import React, { FC } from 'react';
import { MenuBar, MenuBarItem, ListItem, Divider } from 'solo-ui';

import { TabState } from '../../services/ui';
import { useAppState, useAppActions } from '../../services/state';
import { List } from '../list';

import './styles.css';

export const FileMenu: FC = () => {

    const tab = useAppState(s => s.ui.tab);
    const actions = useAppActions();

    return <MenuBar className="file-menu">

        <MenuBarItem label="File">
            <List className="file-menu__list">
                <ListItem>New</ListItem>
                <Divider />
                <ListItem>Open...</ListItem>
                <ListItem>Open Recent</ListItem>
                <Divider />
                <ListItem>Save</ListItem>
                <ListItem>Save As...</ListItem>
                <Divider />
                <ListItem>Close</ListItem>
            </List>
        </MenuBarItem>

        <MenuBarItem label="Edit">
            <List className="file-menu__list">
                <ListItem>Undo</ListItem>
                <ListItem>Redo</ListItem>
                <Divider />
                <ListItem>Cut</ListItem>
                <ListItem>Copy</ListItem>
                <ListItem>Paste</ListItem>
            </List>
        </MenuBarItem>

        <MenuBarItem label="View">
            <List className="file-menu__list">
                <ListItem>Undo</ListItem>
                <ListItem>Redo</ListItem>
                <Divider />
                <ListItem>Cut</ListItem>
                <ListItem>Copy</ListItem>
                <ListItem>Paste</ListItem>
            </List>
        </MenuBarItem>

        {tab === TabState.play && <MenuBarItem label="Play">
            <List className="file-menu__list">
                <ListItem>Play</ListItem>
                <Divider />
                <ListItem>Playback</ListItem>
                <ListItem>Preferences</ListItem>
            </List>
        </MenuBarItem>}

        <MenuBarItem label="Window">
            <List className="file-menu__list">
                <ListItem>Undo</ListItem>
                <ListItem>Redo</ListItem>
                <Divider />
                <ListItem>Cut</ListItem>
                <ListItem>Copy</ListItem>
                <ListItem>Paste</ListItem>
            </List>
        </MenuBarItem>

        <MenuBarItem label="Help">
            <List className="file-menu__list">
                <ListItem>Documentation</ListItem>
                <ListItem>Send Feedback</ListItem>
                <Divider />
                <ListItem onClick={actions.ui.about.open}>About</ListItem>
            </List>
        </MenuBarItem>

    </MenuBar>
}