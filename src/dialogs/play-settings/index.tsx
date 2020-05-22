import React, { useState } from "react";
import { mdiMidiPort } from "@mdi/js";

import { Button, Icon, Subheader, Dialog } from "solo-ui";

import { useCounts } from "../../services/score-instrument";
import { PlaySettingsChannel } from "./play-settings-channel";
import { useAppState, useAppActions } from "../../services/state";
import { MenuItem } from "../../components/menu-item";

import "../generic-settings.css";
import "./styles.css";

enum Page {
    general = 1,
    internal,
    midi
}

interface Props {
    onClose: () => void;
}

export const PlaySettings = Dialog<Props>(({ onClose }) => {
    const actions = useAppActions();

    const { theme, midi, channels, instruments } = useAppState(s => ({
        theme: s.app.theme.pallets,
        midi: s.playback.midi,
        channels: s.playback.sampler.channels.order.map(key => {
            return s.playback.sampler.channels.byKey[key];
        }),
        instruments: s.score.instruments
    }));

    const counts = useCounts();

    const [page, setPage] = useState<Page>(Page.internal);

    return (
        <div className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <MenuItem color={theme.primary[500].bg} selected={page === Page.internal} onClick={() => setPage(Page.internal)}>
                        Internal Sampler
                    </MenuItem>
                    <MenuItem color={theme.primary[500].bg} selected={page === Page.midi} onClick={() => setPage(Page.midi)}>
                        MIDI Devices
                    </MenuItem>
                </div>
                <div className="generic-settings__right-panel">

                    {page === Page.internal && (
                        <>
                            <div className="play-settings__header">
                                <div className="play-settings__cell play-settings__channel" />
                                <div className="play-settings__cell play-settings__map">Patch Map</div>
                                <div className="play-settings__cell play-settings__assigned">Assigned To</div>
                            </div>

                            {channels.map((channel, i) => {
                                return (
                                    <PlaySettingsChannel
                                        key={channel.key}
                                        i={i}
                                        channel={channel}
                                        instruments={instruments}
                                        counts={counts}
                                    />
                                );
                            })}
                        </>
                    )}

                    {page === Page.midi && (
                        <>
                            <div className="generic-settings__section">
                                <Subheader>Midi Inputs</Subheader>
                                {midi.inputs.map(input => {
                                    return (
                                        <div key={input.id} className="play-settings__port">
                                            <Icon
                                                style={{ marginRight: 20 }}
                                                path={mdiMidiPort}
                                                size={24}
                                                color="#000000"
                                            />
                                            <div className="play-settings__port-description">
                                                <p className="play-settings__port-name">{input.name}</p>
                                                <p className="play-settings__port-manufacturer">
                                                    {input.manufacturer || "Unknown Manufacturer"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="generic-settings__section">
                                <Subheader>Midi Outputs</Subheader>
                                {midi.outputs.map(output => {
                                    return (
                                        <div key={output.id} className="play-settings__port">
                                            <Icon
                                                style={{ marginRight: 20 }}
                                                path={mdiMidiPort}
                                                size={24}
                                                color="#000000"
                                            />
                                            <div className="play-settings__port-description">
                                                <p className="play-settings__port-name">{output.name}</p>
                                                <p className="play-settings__port-manufacturer">
                                                    {output.manufacturer || "Unknown Manufacturer"}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => actions.playback.midi.test(output.id)}
                                                compact
                                                outline
                                                color={theme.primary[500].bg}
                                            >
                                                Test
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="generic-settings__buttons">
                <div className="generic-settings__spacer" />
                <Button compact color={theme.primary[500].bg} onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
});
