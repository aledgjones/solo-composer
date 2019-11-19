import { Names } from "./get-names";
import { EngravingConfig } from "../services/engraving";
import { Converter } from "./converter";
import { TextStyles } from "../render/text";
import { measureText } from "./measure-text";


export function measureNames(names: Names, config: EngravingConfig, converter: Converter) {
    const styles: TextStyles = { color: '#000000', font: config.staveInstrumentNameFont, size: config.staveInstrumentNameSize, align: 'left', baseline: 'middle' };
    const keys = Object.keys(names);
    const boxes = keys.map(key => measureText(styles, names[key], converter));
    return Math.max(...boxes);
}