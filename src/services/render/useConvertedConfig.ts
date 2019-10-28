import { Config } from "../config";
import { useMemo } from "react";
import { Converter } from "./converter";

export const useConvertedConfig = (config: Config): Config => {
    return useMemo(() => {
        const { mm, spaces } = Converter(config.writeSpace);
        return {
            writeSpace: mm.toPX(config.writeSpace),
            writePagePadding: {
                top: mm.toPX(config.writePagePadding.left),
                right: mm.toPX(config.writePagePadding.right),
                bottom: mm.toPX(config.writePagePadding.bottom),
                left: mm.toPX(config.writePagePadding.left)
            },
            writeInstrumentSpacing: spaces.toPX(config.writeInstrumentSpacing),
            writeStaveSpacing: spaces.toPX(config.writeStaveSpacing),
            writeSystemStartPadding: spaces.toPX(config.writeSystemStartPadding),

            writeInstrumentNameSize: spaces.toPX(config.writeInstrumentNameSize),
            writeInstrumentNameFont: config.writeInstrumentNameFont,
            writeInstrumentNameGap: spaces.toPX(config.writeInstrumentNameGap),

            writeBracketing: config.writeBracketing
        };
    }, [config]);
}