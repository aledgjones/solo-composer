import React, { useState } from "react";
import { mdiAccount, mdiAccountGroup } from "@mdi/js";
import { Dialog, Icon, Label, Button, Content } from "solo-ui";

import { useAppState } from "../../services/state";
import { PlayerType } from "../../services/score-player";

import "../generic-settings.css";
import "./styles.css";

interface Props {
    onClose: (type?: PlayerType) => void;
}

export const PlayerTypeSelector = Dialog<Props>(({ onClose }) => {

    const theme = useAppState(s => s.app.theme.pallets);
    const [type, setType] = useState(PlayerType.solo);

    const selectedStyles = {
        backgroundColor: theme.primary[500].bg,
        color: theme.primary[500].fg
    }

    return <>
        <Content className="player-type-selector">
            <div style={type === PlayerType.solo ? selectedStyles : undefined} className="player-type-selector__box" onClick={() => setType(PlayerType.solo)}>
                <Icon size={24} color={type === PlayerType.solo ? theme.primary[500].fg : 'rgb(50,50,50)'} path={mdiAccount} />
                <Label>
                    <p>Solo Player</p>
                    <p>A single player who can hold mulpiple instruments</p>
                </Label>
            </div>
            <div style={type === PlayerType.section ? selectedStyles : undefined} className="player-type-selector__box" onClick={() => setType(PlayerType.section)}>
                <Icon size={24} color={type === PlayerType.section ? theme.primary[500].fg : 'rgb(50,50,50)'} path={mdiAccountGroup} />
                <Label>
                    <p>Section Player</p>
                    <p>A group of players all with the same instrument</p>
                </Label>
            </div>
        </Content>
        <div className="generic-settings__buttons">
            <div className="generic-settings__spacer" />
            <Button compact style={{ marginRight: 8 }} outline color={theme.primary[500].bg} onClick={() => onClose()}>
                Cancel
                </Button>
            <Button compact color={theme.primary[500].bg} onClick={() => onClose(type)}>
                Next
                </Button>
        </div>
    </>
});
