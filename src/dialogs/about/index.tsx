import React, { version as ReactVersion } from "react";
import { mdiClose } from "@mdi/js";
import { version as ToneJSVersion } from "tone";
import { Subheader, Content, Label, Icon, Dialog } from "solo-ui";

import { APP_VERSION, THEME } from "../../const";

import logo from "../../assets/logo.png";

import "./styles.css";

interface Props {
    onClose: () => void;
}

export const About = Dialog<Props>(({ onClose }) => {
    return <>
        <div className="about__header">
            <Icon path={mdiClose} color="#000000" size={24} onClick={onClose} />
        </div>
        <div className="about__logo">
            <img className="about__logo-img" alt="Solo Composer Logo" src={logo} />
            <Label className="about__logo-text">
                <p>Solo Composer</p>
                <p>Music notation for the web.</p>
            </Label>
        </div>
        <Content>
            <p className="about__paragraph">This project is very much an experimental work in progress. Things <b>will</b> break, not exist, make no sense and crash! This project is inspired by the amazing work the people at Steinberg are doing on <a style={{ color: THEME.primary[500].backgroundColor }} rel="noopener noreferrer" href="https://new.steinberg.net/dorico/" target="_blank">Dorico</a>.</p>
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
                <span>{ReactVersion.split("-")[0]}</span>
            </p>
        </Content>
    </>
});
