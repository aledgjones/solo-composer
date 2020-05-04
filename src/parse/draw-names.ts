import { Instrument } from "../services/instrument";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { EngravingConfig } from "../services/engraving";
import { buildText, TextStyles, Align, Justify } from "../render/text";

export function drawNames(
    x: number,
    y: number,
    width: number,
    instruments: Instrument[],
    names: { [key: string]: string },
    verticalMeasurements: VerticalMeasurements,
    config: EngravingConfig
) {
    const styles: TextStyles = {
        color: "#000000",
        font: config.instrumentName.font,
        size: config.instrumentName.size,
        justify: config.instrumentName.align,
        align: Align.middle
    };

    const left = config.instrumentName.align === Justify.start ? x : x + width;

    return instruments.map(instrument => {
        const top =
            y +
            verticalMeasurements.instruments[instrument.key].y +
            verticalMeasurements.instruments[instrument.key].height / 2;
        return buildText(`${instrument.key}-name`, styles, left, top, names[instrument.key]);
    });
}
