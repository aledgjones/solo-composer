import { useMemo } from "react";
import { EngravingConfig } from "../engraving";
import { Converter } from "./use-converter";

export const useConvertedConfig = (config: EngravingConfig, converter: Converter): EngravingConfig => {
    return useMemo(() => {
        const { mm, spaces } = converter;
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
    }, [config, converter]);
}