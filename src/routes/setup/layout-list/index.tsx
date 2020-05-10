import React, { FC } from "react";
import { mdiPlus } from "@mdi/js";
import { Icon } from "solo-ui";

import { useAppState } from "../../../services/state";
import { Fallback } from "../../../components/shell/fallback";

import "./styles.css";

interface Props { }

export const LayoutList: FC<Props> = () => {

    const theme = useAppState(s => s.ui.theme.pallets);

    return (
        <div className="layout-list" style={{ backgroundColor: theme.background[500].bg }}>
            <div className="layout-list__header" style={{ backgroundColor: theme.background[400].bg }}>
                <span className="layout-list__label" style={{ color: theme.background[400].fg }}>Layouts</span>
                <Icon disabled size={24} color={theme.background[400].fg} path={mdiPlus} onClick={() => { }} />
            </div>
            <Fallback style={{ height: 'calc(100% - 48px)' }} color={theme.background[500].fg} type="empty" />
        </div>
    );
};
