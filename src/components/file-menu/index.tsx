import React, { FC, useEffect, useRef } from 'react';
import { mdiMenu } from '@mdi/js';

import { ListItem, Divider, Card, Icon, useForeground, Content, Label, Subheader, Button, List } from 'solo-ui';

import { THEME } from '../../const';
import { useAppState, useAppActions } from '../../services/state';

import './styles.css';

export const FileMenu: FC = () => {
    const { open, score } = useAppState(s => {
        return { open: s.ui.menu, score: s.score }
    });
    const actions = useAppActions();

    const fg = useForeground(THEME.grey[300]);

    const element = useRef<HTMLDivElement>(null);

    // auto close
    useEffect(() => {
        const cb = (e: any) => {
            if (!element.current || !element.current.contains(e.target)) {
                actions.ui.menu.close();
            }
        }
        document.addEventListener('click', cb);
        return () => document.removeEventListener('click', cb);
    }, [element, actions.ui.menu]);

    return <div ref={element}>
        <Icon className="file-menu__icon ui-icon--hover" path={mdiMenu} color={fg} size={24} onClick={actions.ui.menu.toggle} />
        {open && <Card className="file-menu">
            <Content className="file-menu__current">
                <Subheader>Current Score</Subheader>
                <div className="file-menu__meta">
                    <Label>
                        <p>{score.meta.title}</p>
                        <p>{score.meta.composer}</p>
                    </Label>
                </div>
                <div className="file-menu__buttons">
                    <Button disabled color={THEME.primary[500]} outline>My Library</Button>
                </div>
            </Content>
            <List onClick={actions.ui.menu.close}>
                <ListItem disabled>Preferences</ListItem>
                <Divider />
                <ListItem disabled>Help &amp; Feedback</ListItem>
                <ListItem onClick={actions.ui.about.open}>About</ListItem>
            </List>
        </Card >
        }
    </div >
}