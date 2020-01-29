import React, { FC, useState } from 'react';

import { Score } from '../../services/score';
import { THEME } from '../../const';
import { useParseWorker } from '../../parse/use-parse';
import { Instruction, InstructionType } from '../../render/instructions';
import { PathInstruction } from '../../render/path';
import { TextInstruction } from '../../render/text';
import { CircleInstruction } from '../../render/circle';
import { Text } from './text';

import './render-write-mode.css';

interface Props {
    score: Score;
}

export const RenderWriteMode: FC<Props> = (({ score }) => {

    const { fg, bg } = THEME.primary[500];

    const [flowKey, setFlowKey] = useState(score.flows.order[0]);
    const instructions = useParseWorker(score, flowKey);

    if (!instructions) {
        return null;
    }

    const { space, width, height, entries } = instructions;

    return <div className="render-write-mode">
        <div className="render-write-mode__container" style={{ width: width * space, height: height * space }}>
            <p className="render-write-mode__flow-name" style={{ color: fg, backgroundColor: bg }}>{score.flows.byKey[flowKey].title}</p>
            <svg className="render-write-mode__svg-layer">
                {entries.map((instruction: Instruction<any>) => {
                    switch (instruction.type) {
                        case InstructionType.path:
                            const path = instruction as PathInstruction;
                            const def = path.points.map((point, i) => {
                                return `${i === 0 ? 'M' : 'L'} ${point[0] * space} ${point[1] * space}`;
                            });
                            return <path key={path.key} fill="none" d={def.join(" ")} stroke={path.styles.color} strokeWidth={path.styles.thickness * space} />
                        case InstructionType.circle:
                            const circle = instruction as CircleInstruction;
                            return <circle key={circle.key} cx={circle.x * space} cy={circle.y * space} r={circle.radius * space} fill={circle.styles.color} />
                        case InstructionType.text:
                            const text = instruction as TextInstruction;
                            return <foreignObject className="render-write-mode__entry--text" key={text.key} x={text.x * space} y={text.y * space}>
                                <Text style={{ fontFamily: text.styles.font, fontSize: text.styles.size * space, alignItems: text.styles.align, justifyContent: text.styles.justify }}>{text.value}</Text>
                            </foreignObject>;
                        default:
                            return null;
                    }
                })}
            </svg>
        </div>
    </div>;
});

