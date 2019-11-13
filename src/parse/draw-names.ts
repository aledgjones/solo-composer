import { Instrument } from "../services/instrument";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { EngravingConfig } from "../services/engraving";
import { buildText, TextStyles } from "../render/text";

export function drawNames(x: number, y: number, instruments: Instrument[], names: { [key: string]: string }, verticalMeasurements: VerticalMeasurements, config: EngravingConfig) {

    const styles: TextStyles = {
        color: '#000000',
        textAlign: 'right',
        fontFamily: config.staveInstrumentNameFont,
        fontSize: config.staveInstrumentNameSize,
        textBaseline: 'middle'
    };

    return instruments.map(instrument => {
        const top = y + verticalMeasurements.instruments[instrument.key].y + (verticalMeasurements.instruments[instrument.key].height / 2) + 1;
        return buildText(styles, x, top, names[instrument.key]);
    });
}