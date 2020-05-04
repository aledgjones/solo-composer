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
                    <p className="about__paragraph">Welcome to this Solo Apps experiment. This is very much a work in progress. Things <b>will</b> break, not exist, make no sense and crash! This project is inspired by the amazing work the people at Steinberg are doing on Dorico. If you haven't checked it out, I recommend you do!</p>
                    <Subheader>Versions</Subheader>
                    <p className="about__version">
                        <span className="about__grow">Application</span>
                        <span>{APP_VERSION}</span>
                    </p>
                    <p className="about__version">
                        <span className="about__grow">Audio Engine (Tone.js)</span>
                        <span>{ToneJSVersion}</span>
                    </p>
                    <p className="about__version">
                        <span className="about__grow">Render Engine (React.js)</span>
                        <span>{ReactVersion}</span>
                    </p>
                </Content>
                <div className="about__buttons">
                    {/* <Button style={{ marginRight: 8 }} outline color={THEME.primary[400]} onClick={actions.ui.about.close}>Changelog</Button> */}
                    <Button color={THEME.primary[400]} onClick={actions.ui.about.close}>Close</Button>
                </div>
            </>
        }
    </Dialog>
}