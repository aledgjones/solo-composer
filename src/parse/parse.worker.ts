import shortid from "shortid";
import { getConverter } from "../parse/converter";
import { parse } from "../parse";
import { Score } from "../services/score";
import { FlowKey } from "../services/flow";
import { defaultEngravingConfig, LayoutType } from "../services/engraving";

const ctx: Worker = self as any;

let latestTaskID = shortid();

ctx.addEventListener("message", (e: any) => {
    const mm: number = e.data.mm
    const score: Score = e.data.score;
    const flowKey: FlowKey = e.data.flowKey;

    const taskID = shortid();
    latestTaskID = taskID;
    const converter = getConverter(mm, score.engraving[LayoutType.score].space || defaultEngravingConfig.space);
    const instructions = parse(score, flowKey, converter);
    if (taskID === latestTaskID) {
        ctx.postMessage(instructions);
    }
});

export default null as any;