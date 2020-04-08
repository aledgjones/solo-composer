import React, { FC, useState, useMemo } from 'react';
import { mdiMidiPort } from '@mdi/js';

import { THEME } from '../const';
import { Backdrop, Card, Button, Icon } from '../ui';
import { ListItem } from '../components/shared/list-item';
import { useCounts } from '../services/instrument';
import { useAppState, useAppActions } from '../services/state';
import { PlaySettingsChannel } from './play-settings-channel';

import './generic-settings.css';
import './play-settings.css';
import { Subheader } from '../ui/components/subheader';

enum Page {
    internal = 1,
    midi
}

interface Props {
    onClose: () => void;
}

export const PlaySettings: FC<Props> = ({ onClose }) => {

    const { midi, channelState, instruments } = useAppState(s => ({
        midi: s.playback.midi,
        channelState: s.playback.sampler.channels,
        instruments: s.score.instruments
    }));

    const channels = useMemo(() => {
        return channelState.order.map(key => {
            return channelState.byKey[key];
        });
    }, [channelState]);

    const actions = useAppActions();
    const counts = useCounts();

    const [page, setPage] = useState<Page>(Page.internal);

    return <Backdrop visible={true}>
        <Card animate className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <ListItem selected={page === Page.internal} onClick={() => setPage(Page.internal)}>Internal Sampler</ListItem>
                    <ListItem selected={page === Page.midi} onClick={() => setPage(Page.midi)}>External MIDI Devices</ListItem>
                </div>
                <div className="generic-settings__right-panel">

                    {page === Page.internal && <>
                        <div className="play-settings__header">
                            <div className="play-settings__cell play-settings__channel" />
                            <div className="play-settings__cell play-settings__map">Patch Map</div>
                            <div className="play-settings__cell play-settings__assigned">Assigned</div>
                        </div>
                        {channels.map((channel, i) => {
                            return <PlaySettingsChannel key={channel.key} i={i} channel={channel} instruments={instruments} counts={counts} />
                        })}
                    </>}

                    {page === Page.midi && <>

                        <div className="generic-settings__section">
                            <Subheader>Midi Inputs</Subheader>
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

                        <div className="generic-settings__section">
                            <Subheader>Midi Outputs</Subheader>
                            {midi.outputs.map(output => {
                                return <div key={output.id} className="play-settings__port">
                                    <Icon style={{ marginRight: 20 }} path={mdiMidiPort} size={24} color="#000000" />
                                    <div className="play-settings__port-description">
                                        <p className="play-settings__port-name">{output.name}</p>
                                        <p className="play-settings__port-manufacturer">{output.manufacturer || 'Unknown Manufacturer'}</p>
                                    </div>
                                    <Button onClick={() => actions.playback.midi.test(output.id)} compact={true} outline={true} color={THEME.primary[500].bg}>Test</Button>
                                </div>
                            })}
                        </div>

                    </>}

                </div>
            </div>
            <div className="generic-settings__buttons">
                <div className="generic-settings__spacer" />
                <Button compact color={THEME.primary[500].bg} onClick={onClose}>Close</Button>
            </div>
        </Card>
    </Backdrop >;
}