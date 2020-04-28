import React, { FC, CSSProperties } from 'react';

import { MenuBar, MenuBarItem, ListItem, Divider } from 'solo-ui';

import './styles.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;
}

export const ShellMenuBar: FC<Props> = ({ id, className, style, children }) => {
    return <MenuBar className="shell-menu-bar">
        <MenuBarItem label="File">
            <ListItem onClick={() => false}>
                <p>New</p>
            </ListItem>
            <ListItem onClick={() => false}>
                <p>Open...</p>
            </ListItem>
            <Divider compact />
            <ListItem onClick={() => false}>
                <p>Save</p>
            </ListItem>
            <ListItem onClick={() => false}>
                <p>Save As...</p>
            </ListItem>
            <Divider compact />
            <ListItem onClick={() => false}>
                <p>Exit</p>
            </ListItem>
        </MenuBarItem>
        <MenuBarItem label="Edit">
            <ListItem disabled onClick={() => false}>
                <p>Undo</p>
            </ListItem>
            <ListItem disabled onClick={() => false}>
                <p>Redo</p>
            </ListItem>
            <Divider compact />
            <ListItem onClick={() => false}>
                <p>Cut</p>
            </ListItem>
            <ListItem onClick={() => false}>
                <p>Copy</p>
            </ListItem>
            <ListItem onClick={() => false}>
                <p>Paste</p>
            </ListItem>
        </MenuBarItem>
        <MenuBarItem label="View">
            <ListItem disabled onClick={() => false}>
                <p>Undo</p>
            </ListItem>
            <ListItem disabled onClick={() => false}>
                <p>Redo</p>
            </ListItem>
            <Divider compact />
            <ListItem onClick={() => false}>
                <p>Cut</p>
            </ListItem>
            <ListItem onClick={() => false}>
                <p>Copy</p>
            </ListItem>
            <ListItem onClick={() => false}>
                <p>Paste</p>
            </ListItem>
        </MenuBarItem>
        <MenuBarItem label="Window">
            <ListItem disabled onClick={() => false}>
                <p>Undo</p>
            </ListItem>
            <ListItem disabled onClick={() => false}>
                <p>Redo</p>
            </ListItem>
            <Divider compact />
            <ListItem onClick={() => false}>
                <p>Cut</p>
            </ListItem>
            <ListItem onClick={() => false}>
                <p>Copy</p>
            </ListItem>
            <ListItem onClick={() => false}>
                <p>Paste</p>
            </ListItem>
        </MenuBarItem>
        <MenuBarItem label="Help">
            <ListItem onClick={() => false}>
                <p>Documentation</p>
            </ListItem>
            <ListItem onClick={() => false}>
                <p>Release Notes</p>
            </ListItem>
            <Divider compact />
            <ListItem onClick={() => false}>
                <p>Check for Updates...</p>
            </ListItem>
            <Divider compact />
            <ListItem onClick={() => false}>
                <p>About</p>
            </ListItem>
        </MenuBarItem>
    </MenuBar >;
}