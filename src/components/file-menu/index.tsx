import React, { FC, useEffect, useRef, useState } from "react";
import { mdiMenu } from "@mdi/js";
import { ListItem, Divider, Card, Icon, Content, Label, Subheader, Button, List } from "solo-ui";

import { useAppState } from "../../services/state";
import { About } from "../../dialogs/about";
import { Changelog } from "../../dialogs/changelog";
import { Preferences } from "../../dialogs/preferences";

import "./styles.css";

export const FileMenu: FC = () => {
    const { theme, meta, dot } = useAppState(s => {
        return {
            theme: s.ui.theme.pallets,
            meta: s.score.meta,
            dot: s.ui.update
        }
    });

    const element = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [about, setAbout] = useState(process.env.NODE_ENV === "production");
    const [changelog, setChangelog] = useState(false);
    const [preferences, setPreferences] = useState(false);

    // auto close
    useEffect(() => {
        const cb = (e: any) => {
            if (!element.current || !element.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", cb);
        return () => document.removeEventListener("click", cb);
    }, [element]);

    return (
        <>
            <div className="file-menu__container" ref={element}>
                {!open && dot && <div style={{ backgroundColor: theme.primary[500].bg }} className="file-menu__dot file-menu__dot--badge" />}
                <Icon
                    className="file-menu__icon ui-icon--hover"
                    path={mdiMenu}
                    color={theme.background[200].fg}
                    size={24}
                    onClick={() => setOpen(o => !o)}
                />
                {open && (
                    <Card className="file-menu">
                        <Content className="file-menu__current">
                            <Subheader>Current Score</Subheader>
                            <div className="file-menu__meta">
                                <Label>
                                    <p>{meta.title}</p>
                                    <p>{meta.composer}</p>
                                </Label>
                            </div>
                            <div className="file-menu__buttons">
                                <Button disabled color={theme.primary[500].bg} outline>
                                    My Library
                                </Button>
                            </div>
                        </Content>
                        <List onClick={() => setOpen(false)}>
                            <ListItem onClick={() => setPreferences(true)}>Preferences</ListItem>
                            <Divider />
                            {dot && <>
                                <ListItem onClick={() => window.location.reload()}>
                                    <Label>
                                        <p>Update available</p>
                                        <p>Restart to apply update now...</p>
                                    </Label>
                                    <div style={{ backgroundColor: theme.primary[500].bg }} className="file-menu__dot" />
                                </ListItem>
                                <Divider />
                            </>}
                            <ListItem disabled>Help &amp; Feedback</ListItem>
                            <ListItem onClick={() => setChangelog(true)}>What's new</ListItem>
                            <ListItem onClick={() => setAbout(true)}>About</ListItem>
                        </List>
                    </Card>
                )}
            </div>

            <About width={400} open={about} onClose={() => setAbout(false)} />
            <Changelog width={600} open={changelog} onClose={() => setChangelog(false)} />
            <Preferences open={preferences} width={900} onClose={() => setPreferences(false)} />
        </>
    );
};
