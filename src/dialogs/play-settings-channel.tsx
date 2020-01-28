import React, { FC } from 'react';
import { mdiChevronRight } from '@mdi/js';

import { Channel } from '../services/sampler';
import { useInstrumentName, Instruments } from '../services/instrument';
import { merge } from '../ui/utils/merge';
import { Spinner, Icon } from '../ui';
import { THEME } from '../const';
import { SamplerCurrentState } from '../playback/sampler';
import { Expressions } from '../playback/expressions';
import { Text } from '../components/shared/text';
import { useAppActions } from '../services/state';
import { InstrumentCounts } from '../services/instrument-utils';

interface Props {
    i: number;
    channel: Channel;
    instruments: Instruments;
    counts: InstrumentCounts;
}

export const PlaySettingsChannel: FC<Props> = ({ i, channel, instruments, counts }) => {

    const actions = useAppActions();

    let instrument, count;
    if (channel.assigned) {
        instrument = instruments[channel.assigned];
        count = counts[channel.assigned];
    }

    const name = useInstrumentName(instrument, count);

    return <div className="play-settings__row">
        <div className={merge("play-settings__cell play-settings__channel", { 'play-settings__cell--unassigned': !channel.patchGroupName })}>
            {channel.state === SamplerCurrentState.loading && <Spinner className="play-settings__spinner" size={18} color={THEME.primary[500].bg} max={1} value={channel.progress} />}
            {channel.state === SamplerCurrentState.ready && i + 1}
        </div>
        <div className={merge("play-settings__cell play-settings__map", { 'play-settings__cell--unassigned': !channel.patchGroupName })}>{channel.patchGroupName || 'Unassigned'}</div>
        <Text className={merge("play-settings__cell play-settings__assigned", { 'play-settings__cell--unassigned': !name })}>{name || 'Unassigned'}</Text>
        <div className="play-settings__cell play-settings__loader">
            <Icon size={24} color="rgb(50,50,50)" path={mdiChevronRight} onClick={() => actions.playback.sampler.test(channel.key, Expressions.natural)} />
        </div>
    </div>
}