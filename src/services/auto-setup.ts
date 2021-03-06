import { useEffect, useMemo } from "react";
import { instrumentDefs } from "./score-instrument-defs";
import { PlayerType } from "./score-player";
import { KeySignatureMode } from "../entries/key-signature";
import { NotationBaseDuration } from "../parse/notation-track";
import { getDefaultGroupings } from "../parse/get-default-groupings";
import { useAppActions, useAppState } from "./state";
import { TabState } from "./ui";

export function useAutoSetup() {
    const actions = useAppActions();
    const score = useAppState((s) => s.score);

    const flowKey = useMemo(() => {
        return score.flows.order[0];
    }, [score.flows.order]);

    useEffect(() => {
        const c = 12;

        actions.score.meta.update({ title: "Hello World (String Quartet)", composer: "Solo Apps" });
        actions.ui.tab.set(TabState.setup);
        actions.score.flows.setLength(flowKey, 4 * c * 8);

        const ids = ["strings.violin"];

        ids.forEach((id) => {
            const def = instrumentDefs[id];
            const instrument = actions.score.instruments.create(def);
            const playerKey = actions.score.players.create(PlayerType.solo);
            actions.score.players.assignInstrument(playerKey, instrument.key);

            const channel = actions.playback.sampler.createChannel();
            actions.playback.sampler.load(channel, def);
            actions.playback.sampler.assignInstrument(instrument.key, channel);
        });

        actions.score.flows.createTimeSignature(
            { beats: 4, beatType: 4, groupings: getDefaultGroupings(4) },
            0,
            flowKey
        );
        actions.score.flows.createKeySignature({ mode: KeySignatureMode.minor, offset: -3 }, 0, flowKey);
        actions.score.flows.createAbsoluteTempo(
            {
                text: "Allegro",
                beat: NotationBaseDuration.crotchet,
                dotted: 0,
                beatPerMinute: 120,
                textVisible: true,
                beatPerMinuteVisible: true,
                parenthesis: true
            },
            0,
            flowKey
        );
    }, [actions, flowKey]);
}
