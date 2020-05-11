import React, { useState, useEffect } from "react";
import { mdiClose } from "@mdi/js";
import { MarkdownContent, Icon, Dialog } from "solo-ui";

import { useAppState } from "../../services/state";
import { Fallback } from "../../components/shell/fallback";
import changlogFile from './CHANGELOG.md';

import "./styles.css";

interface Props {
    onClose: () => void;
}

export const Changelog = Dialog<Props>(({ onClose }) => {

    const theme = useAppState(s => s.ui.theme.pallets);
    const [changes, setChanges] = useState('');

    useEffect(() => {
        const call = async () => {
            const resp = await fetch(changlogFile);
            const text = await resp.text();
            setChanges(text);
        };
        call();
    }, []);

    return <>
        <div className="changelog__header">
            <h1 className="changelog__title">What's New</h1>
            <Icon path={mdiClose} color="#000000" size={24} onClick={onClose} />
        </div>
        <div className="changelog__content">
            {changes ? <MarkdownContent className="changelog__md" markdown={changes} theme={theme.primary[500].bg} /> : <Fallback color="#000000" type="loading" />}
        </div>
    </>
});