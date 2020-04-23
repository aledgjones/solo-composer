import React, { FC, useState, useMemo } from 'react';
import { mdiMidiPort } from '@mdi/js';

import { Button, Icon, Subheader } from 'solo-ui';

import { THEME } from '../const';
import { useCounts } from '../services/instrument';
import { useAppState, useAppActions } from '../services/state';
import { ListItem } from '../components/shared/list-item';
import { PlaySettingsChannel } from './play-settings-channel';

import './generic-settings.css';
import './play-settings.css';

enum Page {
    internal = 1,
    midi
}

interface Props {
    onClose: () => void;
}

export const PlaySettings: FC<Props> = ({ onClose }) => {

    const { midi, sampler, instruments } = useAppState(s => ({
        midi: s.playback.midi,
        sampler: s.playback.sampler,
        instruments: s.score.instruments
    }));

    const channels = useMemo(() => {
        return sampler.channels.order.map(key => {
            return sampler.channels.byKey[key];
        });
    }, [sampler.channels]);

    const actions = useAppActions();
    const counts = useCounts();

    const [page, setPage] = useState<Page>(Page.internal);

    return <div className="generic-settings">
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
                        <div className="play-settings__cell play-settings__assigned">Assigned To</div>
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
                                <Button onClick={() => actions.playback.midi.test(output.id)} compact={true} outline={true} color={THEME.primary[500]}>Test</Button>
                            </div>
                        })}
                    </div>

                </>}

            </div>
        </div>
        <div className="generic-settings__buttons">
            <div className="generic-settings__spacer" />
            <Button compact color={THEME.primary[500]} onClick={onClose}>Close</Button>
        </div>
    </div>
}