import React, { FC, useState } from "react";
import { mdiCogOutline } from "@mdi/js";

import { useTitle, Icon } from "solo-ui";

import { RenderRegion } from "../../components/render-region";
import { RenderWriteMode } from "../../components/render-write-mode";
import { Panel } from "../../components/panel";
import { EngraveSettings } from "../../dialogs/engrave-settings";
import { useAppState } from "../../services/state";

import "./styles.css";

const Engrave: FC = () => {
    useTitle("Solo Composer | Engrave");
    const theme = useAppState(s => s.ui.theme.pallets);
    const [settings, setSettings] = useState(false);

    return (
        <>
            <div className="engrave">
                <RenderRegion>
                    <RenderWriteMode className="engrave__renderer" />
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

export default Engrave;
