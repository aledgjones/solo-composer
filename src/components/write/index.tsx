import React, { FC } from 'react';

import { useAppState, useAppActions } from '../../services/state';
import { RenderRegion } from '../shared/render-region';
import { RenderWriteMode } from '../shared/render-write-mode';
import { EngravingSettings } from '../../dialogs/engraving-settings';

import './write.css';

interface Props {
    settings: boolean;
    onSettingsClose: () => void;
}

export const Write: FC<Props> = ({ settings, onSettingsClose }) => {

    const actions = useAppActions();
    const score = useAppState(s => s.score);

    return <>
        <div className="write">
            <RenderRegion>
                <RenderWriteMode score={score} />
            </RenderRegion>
        </div>

        {settings && <EngravingSettings config={score.engraving} onClose={() => onSettingsClose()} onUpdate={(layout, instruction) => actions.score.engraving.set(layout, instruction)} />}
    </>;
}