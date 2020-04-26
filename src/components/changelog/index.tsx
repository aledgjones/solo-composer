import React, { useState, useEffect } from 'react';
import { mdiClose } from '@mdi/js';

import { Icon, MarkdownContent, Dialog } from 'solo-ui';

import { THEME } from '../../const';

import source from './CHANGELOG.md';

import './styles.css';

export const Changelog = () => {

    const [show, setShow] = useState(process.env.NODE_ENV === 'production');
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
                    <Icon path={mdiClose} size={24} color="#000000" onClick={() => setShow(false)} />
                </div>
                <MarkdownContent className="changelog__content" markdown={md} theme={THEME.primary[500]} />
            </>
        }
    </Dialog>
}