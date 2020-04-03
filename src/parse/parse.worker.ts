import shortid from "shortid";
import { parse } from "../parse";
import { Score } from "../services/score";
import { FlowKey } from "../services/flow";
import { Timer } from "../ui/utils/timer";

const ctx = self as unknown as Worker; // eslint-disable-line

let latestTaskID = shortid();

ctx.addEventListener("message", (e: any) => {
    const timer = Timer('parse');

    const mm: number = e.data.mm
    const score: Score = e.data.score;
    const flowKey: FlowKey = e.data.flowKey;

    const taskID = shortid();
    latestTaskID = taskID;
    const instructions = parse(score, flowKey, mm);
    if (taskID === latestTaskID) {
        ctx.postMessage(instructions );
    }

    timer.stop();
});

export default null as any;