import React, { FC } from "react";

import { useTitle } from "solo-ui";

import { RenderRegion } from "../../components/render-region";
import { RenderWriteMode } from "../../components/render-write-mode";
import { EngravingSettings } from "../../dialogs/engraving-settings";

import "./write.css";

const Write: FC = () => {
    useTitle("Solo Composer | Write");

    return (
        <>
            <div className="write">
                <RenderRegion>
                    <RenderWriteMode />
                </RenderRegion>
            </div>
            <EngravingSettings open={false} width={900} onClose={() => false} />
        </>
    );
};

export default Write;
