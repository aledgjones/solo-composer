import { getConverter, Converter, ConverterGenerator } from "../parse/converter";
import { loadFont } from "../render/load-font";
import { parse } from "../parse";
import { render, resize } from "../render";
import { Score } from "../services/score";
import { FlowKey } from "../services/flow";
import { RenderInstructions } from "../parse/instructions";
import { Timer } from "../ui/utils/timer";
import { defaultEngravingConfig, EngravingConfig } from "../services/engraving";
import { getConvertedConfig } from "../parse/get-converted-config";
import { RenderEvents } from "../render/render-events";

const ctx: Worker = self as any;

let ready = false;
let score: Score;
let flowKey: FlowKey;
let context: OffscreenCanvasRenderingContext2D | null;
let converterGenerator: ConverterGenerator;
let converter: Converter;
let config: EngravingConfig;
let instructions: RenderInstructions = { height: 200.0, width: 200.0, entries: [] };

async function route(e: any) {
    switch (e.data.type) {
        case RenderEvents.Init: {
            const canvas: OffscreenCanvas = e.data.canvas;
            const mm: number = e.data.mm;

            context = canvas.getContext('2d', { alpha: false, desynchronized: true });
            converterGenerator = getConverter(mm);

            await loadFont('Music', '/bravura.woff2');
            await loadFont('Libre Baskerville', '/libre-baskerville.woff2');

            ready = true;

            go();
            break;
        }
        case RenderEvents.Update:
        default:
            const timer = Timer('parse');
            score = e.data.score;
            flowKey = e.data.flowKey;
            go();
            timer.stop();
            break;
    }
}

function go() {
    if (context && ready) {
        converter = converterGenerator(score.engraving.score.space || defaultEngravingConfig.space);
        config = getConvertedConfig({ ...defaultEngravingConfig, ...score.engraving.score }, converter);
        instructions = parse(score, flowKey, config, converter);

        const { height, width } = resize(context, instructions, converter);
        ctx.postMessage({ type: RenderEvents.Resize, width, height });
        render(context, instructions, converter);
    }
}

ctx.addEventListener("message", route);

export default null as any;