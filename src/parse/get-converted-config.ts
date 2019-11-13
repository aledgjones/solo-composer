import { EngravingConfig } from "../services/engraving";
import { Converter } from "./converter";

export const getConvertedConfig = (config: EngravingConfig, converter: Converter): EngravingConfig => {
    const { mm, spaces } = converter;
    return {
        space: mm.toPX(config.space),
        framePadding: {
            top: mm.toPX(config.framePadding.top),
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
        bracketSingleStaves: config.bracketSingleStaves,
        subBracket: config.subBracket,
        
        finalBarlineType: config.finalBarlineType
    };
}