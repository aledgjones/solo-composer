import React, { FC } from "react";

import { Dialog, useTitle } from "solo-ui";

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
            <Dialog open={false} width={900}>
                {() => <EngravingSettings onClose={() => false} />}
            </Dialog>
        </>
    );
};

export default Write;
