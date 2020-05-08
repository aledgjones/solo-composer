import React, { useState, useEffect } from "react";
import { mdiClose } from "@mdi/js";
import { MarkdownContent, Icon, Dialog } from "solo-ui";

import { THEME } from "../../const";
import { Fallback } from "../../components/shell/fallback";
import changlogFile from './CHANGELOG.md';

import "./styles.css";

interface Props {
    onClose: () => void;
}

export const Changelog = Dialog<Props>(({ onClose }) => {

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
            {changes ? <MarkdownContent className="changelog__md" markdown={changes} theme={THEME.primary[500].backgroundColor} /> : <Fallback color="#000000" type="loading" />}
        </div>
    </>
});
