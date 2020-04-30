import React, { useState, useEffect } from 'react';
import { mdiClose } from '@mdi/js';

import { Icon, MarkdownContent, Dialog } from 'solo-ui';

import { THEME } from '../../const';
import { useAppState, useAppActions } from '../../services/state';

import source from './CHANGELOG.md';

import './styles.css';

export const Changelog = () => {

    const show = useAppState(s => s.ui.about);
    const actions = useAppActions();

    const [md, setMd] = useState('');

    useEffect(() => {
        (async function call() {
            const resp = await fetch(source);
            const text = await resp.text();
            setMd(text);
        })();
    }, []);

    return <Dialog width={900} className="changelog" open={show}>
        {
            () => <>
                <div className="changelog__head">
                    <h2 className="changelog__h2">About</h2>
                    <Icon path={mdiClose} size={24} color="#000000" onClick={actions.ui.about.close} />
                </div>
                <MarkdownContent className="changelog__content" markdown={md} theme={THEME.primary[500]} />
            </>
        }
    </Dialog>
}