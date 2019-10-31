import { useMemo } from "react";
import { Converter } from "./converter";
import { EngravingConfig } from "../engraving";

export const useConvertedConfig = (config: EngravingConfig): EngravingConfig => {
    return useMemo(() => {
        const { mm, spaces } = Converter(config.space);
        return {
            space: mm.toPX(config.space),
            framePadding: {
                top: mm.toPX(config.framePadding.left),
                right: mm.toPX(config.framePadding.right),
                bottom: mm.toPX(config.framePadding.bottom),
                left: mm.toPX(config.framePadding.left)
            },
            instrumentSpacing: spaces.toPX(config.instrumentSpacing),
            staveSpacing: spaces.toPX(config.staveSpacing),
            systemStartPadding: spaces.toPX(config.systemStartPadding),

            staveInstrumentNameSize: spaces.toPX(config.staveInstrumentNameSize),
            staveInstrumentNameFont: config.staveInstrumentNameFont,
            staveInstrumentNameGap: spaces.toPX(config.staveInstrumentNameGap),

            bracketing: config.bracketing,
            bracketEndStyle: config.bracketEndStyle,
            bracketSingleStaves: config.bracketSingleStaves
        };
    }, [config]);
}