import React, { version as ReactVersion } from "react";
import { mdiClose } from "@mdi/js";
import { version as ToneJSVersion } from "tone";
import { Subheader, Content, Label, Icon, Dialog } from "solo-ui";

import app from "../../app.json";
import { useAppState } from "../../services/state";

import logo from "../../assets/logo-silo.svg";

import "./styles.css";

interface Props {
    onClose: () => void;
}

export const About = Dialog<Props>(({ onClose }) => {

    const theme = useAppState(s => s.app.theme.pallets);

    return <>
        <div className="about__header">
            <Icon path={mdiClose} color={theme.primary[500].bg} size={24} onClick={onClose} />
        </div>
        <div className="about__logo">
            <img className="about__logo-img" alt="Solo Composer Logo" src={logo} />
            <Label className="about__logo-text" style={{ color: theme.primary[500].bg }}>
                <p>{app.name}</p>
                <p>{app.description}</p>
            </Label>
        </div>
        <Content className="about__content">
            <p className="about__paragraph">This project is very much an experimental work in progress. Things <b>will</b> break, not exist, make no sense and crash! This project is inspired by the amazing work the people at Steinberg are doing on <a style={{ color: theme.primary[500].bg }} rel="noopener noreferrer" href="https://new.steinberg.net/dorico/" target="_blank">Dorico</a>.</p>
        </Content>
        <Content className="about__versions">
            <Subheader>Versions</Subheader>
            <p className="about__version">
                <span className="about__grow">Application</span>
                <span>{app.version}</span>
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
