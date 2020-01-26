import { Names } from "./get-names";
import { EngravingConfig } from "../services/engraving";
import { Converter } from "./converter";
import { TextStyles, Justify, Align } from "../render/text";
import { measureText } from "./measure-text";


export function measureNames(names: Names, config: EngravingConfig, converter: Converter) {
    const styles: TextStyles = { color: '#000000', font: config.instrumentName.font, size: config.instrumentName.size, justify: Justify.start, align: Align.top };
    const keys = Object.keys(names);
    const boxes = keys.map(key => measureText(styles, names[key], converter));
    return Math.max(...boxes, 0); // add a zero incase we dont actually have any widths
}