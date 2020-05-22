import React, { FC, useState } from "react";
import { mdiCogOutline } from "@mdi/js";

import { useTitle, Icon } from "solo-ui";

import { RenderRegion } from "../../components/render-region";
import { RenderWriteMode } from "../../components/render-write-mode";
import { Panel } from "../../components/panel";
import { EngraveSettings } from "../../dialogs/engrave-settings";
import { useAppState } from "../../services/state";

import "./write.css";

const Write: FC = () => {
    useTitle("Solo Composer | Write");
    const theme = useAppState(s => s.app.theme.pallets);
    const [settings, setSettings] = useState(false);

    return (
        <>
            <div className="write">
                <RenderRegion>
                    <RenderWriteMode className="write__renderer" />
                </RenderRegion>
            </div>

            <Panel>
                <div className="panel__wrapper" />
                <div className="panel__wrapper panel__wrapper--settings">
                    <div data-tooltip="Engrave Settings" data-tooltip-direction="right">
                        <Icon
                            className="panel__tool"
                            path={mdiCogOutline}
                            size={24}
                            color={theme.background[400].fg}
                            onClick={() => setSettings(true)}
                        />
                    </div>
                </div>
            </Panel>

            <EngraveSettings open={settings} width={900} onClose={() => setSettings(false)} />
        </>
    );
};

export default Write;
