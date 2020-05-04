import { EngravingConfig } from "../services/engraving";
import { Converter } from "./converter";

export const getConvertedConfig = (
    config: EngravingConfig,
    converter: Converter
): EngravingConfig => {
    const { mm } = converter;
    return {
        ...config,
        space: mm.toSpaces(config.space),
        framePadding: {
            top: mm.toSpaces(config.framePadding.top),
            right: mm.toSpaces(config.framePadding.right),
            bottom: mm.toSpaces(config.framePadding.bottom),
            left: mm.toSpaces(config.framePadding.left)
        }
    };
};
