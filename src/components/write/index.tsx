import React, { FC } from 'react';

import { useAppState, useAppActions } from '../../services/state';
import { RenderRegion } from '../shared/render-region';
import { RenderWriteMode } from '../shared/render-write-mode';
import { EngravingSettings } from '../../dialogs/engraving-settings';

import './write.css';
import { Dialog } from 'solo-ui';

interface Props {
    settings: boolean;
    onSettingsClose: () => void;
}

const Write: FC<Props> = ({ settings, onSettingsClose }) => {

    const actions = useAppActions();
    const score = useAppState(s => s.score);

    return <>
        <div className="write">
            <RenderRegion>
                <RenderWriteMode score={score} />
            </RenderRegion>
        </div>
        <Dialog open={settings} width={900}>
            {() => <EngravingSettings config={score.engraving} onClose={() => onSettingsClose()} onUpdate={(layout, instruction) => actions.score.engraving.set(layout, instruction)} />}
        </Dialog>
    </>;
}

export default Write;