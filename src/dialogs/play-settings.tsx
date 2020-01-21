import React, { FC, useState, useMemo } from 'react';
import { mdiMidiPort } from '@mdi/js';

import { Theme } from '../const';
import { Backdrop, Card, Button, Icon } from '../ui';
import { ListItem } from '../components/shared/list-item';
import { PlaybackActions } from '../services/playback';
import { useCounts } from '../services/instrument';
import { State } from '../services/state';
import { PlaySettingsChannel } from './play-settings-channel';

import './generic-settings.css';
import './play-settings.css';
import { DialogHeader } from './dialog-header';

enum Page {
    internal = 1,
    midi
}

interface Props {
    state: State;
    actions: PlaybackActions;
    onClose: () => void;
}

export const PlaySettings: FC<Props> = ({ state, actions, onClose }) => {

    const [page, setPage] = useState<Page>(Page.internal);
    const midi = state.playback.midi;

    const counts = useCounts(state.score.players, state.score.instruments, state.score.config);
    const channels = useMemo(() => {
        return state.playback.sampler.channels.order.map(key => {
            return state.playback.sampler.channels.byKey[key];
        });
    }, [state.playback.sampler.channels]);

    return <Backdrop visible={true}>
        <Card animate className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <ListItem selected={page === Page.internal} onClick={() => setPage(Page.internal)}>Internal Sampler</ListItem>
                    <ListItem selected={page === Page.midi} onClick={() => setPage(Page.midi)}>External MIDI Devices</ListItem>
                </div>
                <div className="generic-settings__right-panel">

                    {page === Page.internal && <>
                        <div className="generic-settings__group">
                            <DialogHeader className="play-settings__header">
                                <div className="play-settings__cell play-settings__channel" />
                                <div className="play-settings__cell play-settings__map">Patch Map</div>
                                <div className="play-settings__cell play-settings__assigned">Assigned</div>
                            </DialogHeader>
                            {channels.map((channel, i) => {
                                return <PlaySettingsChannel key={channel.key} i={i} channel={channel} actions={actions} instruments={state.score.instruments} counts={counts} />
                            })}
                        </div>
                    </>}

                    {page === Page.midi && <>

                        <div className="generic-settings__group">
                            <DialogHeader>Midi Inputs</DialogHeader>
                            <div className="generic-settings__section">
                                {midi.inputs.map(input => {
                                    return <div key={input.id} className="play-settings__port">
                                        <Icon style={{ marginRight: 20 }} path={mdiMidiPort} size={24} color="#000000" />
                                        <div className="play-settings__port-description">
                                            <p className="play-settings__port-name">{input.name}</p>
                                            <p className="play-settings__port-manufacturer">{input.manufacturer || 'Unknown Manufacturer'}</p>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>

                        <div className="generic-settings__group">
                            <DialogHeader>Midi Outputs</DialogHeader>
                            <div className="generic-settings__section">
                                {midi.outputs.map(output => {
                                    return <div key={output.id} className="play-settings__port">
                                        <Icon style={{ marginRight: 20 }} path={mdiMidiPort} size={24} color="#000000" />
                                        <div className="play-settings__port-description">
                                            <p className="play-settings__port-name">{output.name}</p>
                                            <p className="play-settings__port-manufacturer">{output.manufacturer || 'Unknown Manufacturer'}</p>
                                        </div>
                                        <Button onClick={() => actions.midi.test(output.id)} compact={true} outline={true} color={Theme.primary}>Test</Button>
                                    </div>
                                })}
                            </div>
                        </div>

                    </>}

                </div>
            </div>
            <div className="generic-settings__buttons">
                <div className="generic-settings__spacer" />
                <Button compact color={Theme.primary} onClick={onClose}>Close</Button>
            </div>
        </Card>
    </Backdrop >;
}