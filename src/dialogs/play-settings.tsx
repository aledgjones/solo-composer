import React, { FC, useState } from 'react';
import { Theme, APP_SHORT_NAME } from '../const';
import { mdiMidiPort } from '@mdi/js';

import { Backdrop, Card, Button, Icon } from '../ui';
import { ListItem } from '../components/shared/list-item';
import { PlaybackState, PlaybackActions } from '../services/playback';

import './generic-settings.css';
import './play-settings.css';

enum Page {
    internal = 1,
    midi
}

interface Props {
    state: PlaybackState;
    actions: PlaybackActions;
    onClose: () => void;
}

export const PlaySettings: FC<Props> = ({ state, actions, onClose }) => {

    const [page, setPage] = useState<Page>(Page.internal);

    return <Backdrop visible={true}>
        <Card animate className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <ListItem selected={page === Page.internal} onClick={() => setPage(Page.internal)}>{APP_SHORT_NAME} Sampler</ListItem>
                    <ListItem selected={page === Page.midi} onClick={() => setPage(Page.midi)}>External MIDI Devices</ListItem>
                </div>
                <div className="generic-settings__right-panel">

                    {page === Page.internal && <>
                        <div className="generic-settings__section">

                        </div>
                    </>}

                    {page === Page.midi && <>

                        <div className="generic-settings__header">Midi Inputs</div>
                        <div className="generic-settings__section">
                            {state.midi.inputs.map(input => {
                                return <div key={input.id} className="play-settings__port">
                                    <Icon style={{marginRight: 20}} path={mdiMidiPort} size={24} color="#000000" />
                                    <div className="play-settings__port-description">
                                        <p className="play-settings__port-name">{input.name}</p>
                                        <p className="play-settings__port-manufacturer">{input.manufacturer || 'Unknown Manufacturer'}</p>
                                    </div>
                                </div>
                            })}
                        </div>

                        <div className="generic-settings__header">Midi Outputs</div>
                        <div className="generic-settings__section">
                            {state.midi.outputs.map(output => {
                                return <div key={output.id} className="play-settings__port">
                                    <Icon style={{marginRight: 20}} path={mdiMidiPort} size={24} color="#000000" />
                                    <div className="play-settings__port-description">
                                        <p className="play-settings__port-name">{output.name}</p>
                                        <p className="play-settings__port-manufacturer">{output.manufacturer || 'Unknown Manufacturer'}</p>
                                    </div>
                                    <Button onClick={() => actions.midi.test(output.id)} compact={true} outline={true} color={Theme.primary}>Test</Button>
                                </div>
                            })}
                        </div>

                    </>}

                </div>
            </div>
            <div className="generic-settings__buttons">
                <div className="generic-settings__spacer" />
                <Button compact color={Theme.primary} onClick={onClose}>Close</Button>
            </div>
        </Card>
    </Backdrop>;
}