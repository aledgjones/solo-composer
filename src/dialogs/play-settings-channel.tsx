import React, { FC } from 'react';
import { PlaybackActions } from '../services/playback';
import { Channel } from '../services/sampler';
import { useInstrumentName, Instruments, InstrumentCounts } from '../services/instrument';
import { merge } from '../ui/utils/merge';

interface Props {
    i: number;
    channel: Channel;
    actions: PlaybackActions;

    instruments: Instruments;
    counts: InstrumentCounts;
}

export const PlaySettingsChannel: FC<Props> = ({ i, channel, instruments, counts, actions }) => {

    let instrument, count;
    if (channel.assigned) {
        instrument = instruments[channel.assigned];
        count = counts[channel.assigned];
    }

    const name = useInstrumentName(instrument, count);

    return <div className="play-settings__row">
        <div className="play-settings__cell play-settings__channel">{i + 1}</div>
        <div className={merge("play-settings__cell play-settings__assigned", { 'play-settings__assigned--unassigned': !name })}>{name || 'Unassigned'}</div>
        <div className="play-settings__cell play-settings__map">{channel.patchName}</div>
    </div>
}