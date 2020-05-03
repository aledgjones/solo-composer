import React, { version as ReactVersion } from 'react';
import { version as ToneJSVersion } from 'tone';

import { Dialog, Subheader, Content, Label, Button } from 'solo-ui';

import { APP_VERSION, THEME } from '../../const';
import { useAppState, useAppActions } from '../../services/state';

import logo from '../../assets/logo.png';

import './styles.css';

export const About = () => {

    const show = useAppState(s => s.ui.about);
    const actions = useAppActions();

    return <Dialog width={400} className="about" open={show}>
        {
            () => <>
                <div className="about__logo">
                    <img className="about__logo-img" alt="Solo Composer Logo" src={logo} />
                    <Label className="about__logo-text">
                        <p>Solo Composer</p>
                        <p>Music notation for the web.</p>
                    </Label>
                </div>
                <Content>
                    <Subheader>About</Subheader>
                    <p className="about__paragraph">This is an early stages work in progress. Things will break, not exist, make no sense and crash!</p>
                    <Subheader>Versions</Subheader>
                    <p className="about__version">
                        <span className="about__grow">Application</span>
                        <span>v{APP_VERSION}</span>
                    </p>
                    <p className="about__version">
                        <span className="about__grow">Audio Engine (Tone.js)</span>
                        <span>v{ToneJSVersion}</span>
                    </p>
                    <p className="about__version">
                        <span className="about__grow">Render Engine (React.js)</span>
                        <span>v{ReactVersion}</span>
                    </p>
                </Content>
                <div className="about__buttons">
                    <div />
                    {/* <Button color={THEME.primary[500]} outline>Changelog</Button> */}
                    <Button color={THEME.primary[500]} onClick={actions.ui.about.close}>Close</Button>
                </div>
            </>
        }
    </Dialog>
}