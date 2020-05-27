import { useMemo, useEffect, useState } from "react";

import { FlowKey } from "../services/score-flow";
import { RenderInstructions } from "../render/instructions";
import { Score } from "../services/score";
import { useMM } from "./converter";

import myWorker from "./parse.worker";

export function useParseWorker(score: Score, flowKey: FlowKey) {
    const [instructions, setInstructions] = useState<RenderInstructions>();

    const worker = useMemo(() => {
        return new myWorker() as Worker;
    }, []);

    const mm = useMM();

    useEffect(() => {
        worker.postMessage({ mm, score, flowKey });
    }, [mm, score, flowKey, worker]);

    useEffect(() => {
        const cb = (e: any) => {
            setInstructions(e.data);
        };
        worker.addEventListener("message", cb);
        return () => {
            worker.removeEventListener("message", cb);
            worker.terminate();
        };
    }, [worker]);

    return instructions;
}
