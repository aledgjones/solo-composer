import React, { FC } from "react";
import { mdiChevronRight } from "@mdi/js";

import { Spinner, Icon, merge } from "solo-ui";

import { Channel, SamplerCurrentState } from "../../services/playback-sampler";
import { useInstrumentName, Instruments } from "../../services/score-instrument";
import { useAppActions, useAppState } from "../../services/state";
import { InstrumentCounts } from "../../services/score-instrument-utils";
import { Text } from "../../components/text";

interface Props {
    i: number;
    channel: Channel;
    instruments: Instruments;
    counts: InstrumentCounts;
}

export const PlaySettingsChannel: FC<Props> = ({ i, channel, instruments, counts }) => {
    const actions = useAppActions();
    const theme = useAppState(s => s.app.theme.pallets);

    let instrument, count;
    if (channel.assigned) {
        instrument = instruments[channel.assigned];
        count = counts[channel.assigned];
    }

    const name = useInstrumentName(instrument, count);

    return (
        <div className="play-settings__row">
            <div
                className={merge("play-settings__cell play-settings__channel", {
                    "play-settings__cell--unassigned": !channel.patchGroupName
                })}
            >
                {channel.state === SamplerCurrentState.loading && (
                    <Spinner
                        className="play-settings__spinner"
                        size={18}
                        color={theme.primary[500].bg}
                        percent={channel.progress * 100}
                    />
                )}
                {channel.state === SamplerCurrentState.ready && i + 1}
            </div>
            <div
                className={merge("play-settings__cell play-settings__map", {
                    "play-settings__cell--unassigned": !channel.patchGroupName
                })}
            >
                {channel.patchGroupName || "Unassigned"}
            </div>
            <Text
                className={merge("play-settings__cell play-settings__assigned", {
                    "play-settings__cell--unassigned": !name
                })}
            >
                {name || "Unassigned"}
            </Text>
            <div className="play-settings__cell play-settings__loader">
                <Icon
                    size={24}
                    color="rgb(50,50,50)"
                    path={mdiChevronRight}
                    onClick={() => actions.playback.sampler.test(channel.key)}
                />
            </div>
        </div>
    );
};
