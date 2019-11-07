import { Instrument } from "../instrument";
import { SystemMetrics } from "./use-measure-system";
import { EngravingConfig } from "../engraving";
import { Renderer, Styles } from "./renderer";

export function drawNames(renderer: Renderer, x: number, y: number, instruments: Instrument[], names: { [key: string]: string }, metrics: SystemMetrics, config: EngravingConfig) {

    const styles: Styles = {
        color: '#000000',
        textAlign: 'right',
        fontFamily: config.staveInstrumentNameFont,
        fontSize: config.staveInstrumentNameSize,
        textBaseline: 'middle'
    };

    instruments.forEach(instrument => {
        const top = y + metrics.instruments[instrument.key].y + (metrics.instruments[instrument.key].height / 2) + 1;
        renderer.text(styles, names[instrument.key], x, top);
    });
}