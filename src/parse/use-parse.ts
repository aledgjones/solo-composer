import { useMemo, useEffect, useState } from "react";

import { FlowKey } from "../services/score-flow";
import { RenderInstructions } from "../render/instructions";
import { Score } from "../services/score";
import { useMM } from "./converter";

import myWorker from "./parse.worker";
import wasm from "solo-composer-parser/solo_composer_parser_bg.wasm";
import init, { InitOutput } from "solo-composer-parser";

export function useParseWorker(score: Score, flowKey: FlowKey) {
    const [parser, setParser] = useState<InitOutput>();

    useEffect(() => {
        init(wasm).then((mod) => {
            setParser(mod);
        });
    }, []);

    const [instructions, setInstructions] = useState<RenderInstructions>();

    const mm = useMM();

    useEffect(() => {
        parser?.greet();
    }, [parser]);

    return instructions;
}
