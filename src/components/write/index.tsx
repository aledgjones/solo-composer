import React, { FC } from 'react';

import { State, Actions } from '../../services/state';

import { RenderRegion } from '../shared/render-region';
import { RenderWriteMode } from '../shared/render-write-mode';
import { EngravingSettings } from '../../dialogs/engraving-settings';

import './write.css';

interface Props {
    state: State;
    actions: Actions;

    settings: boolean;
    onSettingsClose: () => void;
}

export const Write: FC<Props> = ({ state, actions, settings, onSettingsClose }) => {
    return <>
        <div className="write">
            <RenderRegion>
                <RenderWriteMode score={state.score} />
            </RenderRegion>
        </div>

        {settings && <EngravingSettings config={state.score.engraving} onClose={() => onSettingsClose()} onUpdate={(layout, instruction) => actions.score.engraving.set(layout, instruction)} />}
    </>;
}