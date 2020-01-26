import { Converter } from "./converter";
import { TextStyles } from "../render/text";

export function measureText(styles: TextStyles, text: string, converter: Converter) {
    const node = document.createElement('div');
    node.style.position = 'fixed';
    node.style.top = "-1000px";
    node.style.fontFamily = styles.font;
    node.style.fontSize = `${converter.spaces.toPX(styles.size)}px`;
    node.textContent = text;
    document.body.append(node);
    const width = converter.px.toSpaces(node.clientWidth);
    node.remove();
    return width;
}