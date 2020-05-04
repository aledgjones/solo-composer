import shortid from "shortid";
import { parse } from "../parse";
import { Score } from "../services/score";
import { FlowKey } from "../services/flow";

const ctx = (self as unknown) as Worker; // eslint-disable-line

let latestTaskID = shortid();

ctx.addEventListener("message", (e: any) => {
    const mm: number = e.data.mm;
    const score: Score = e.data.score;
    const flowKey: FlowKey = e.data.flowKey;

    const taskID = shortid();
    latestTaskID = taskID;
    const instructions = parse(score, flowKey, mm);
    if (taskID === latestTaskID) {
        ctx.postMessage(instructions);
    }
});

export default null as any;
