import React, { FC, useState } from 'react';

import { Score } from '../../services/score';
import { THEME } from '../../const';
import { useConverter } from '../../parse/converter';
import { LayoutType } from '../../services/engraving';
import { useParse } from '../../parse';
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

    const [flowKey, setFlowKey] = useState(score.flows.order[0]);

    const { fg, bg } = THEME.primary[500];

    const converter = useConverter(score.engraving[LayoutType.score].space);
    const instructions = useParse(score, flowKey, converter);

    const px = converter.spaces.toPX;

    return <div className="render-write-mode">
        <div className="render-write-mode__container" style={{ width: px(instructions.width), height: px(instructions.height) }}>
            <p className="render-write-mode__flow-name" style={{ color: fg, backgroundColor: bg }}>{score.flows.byKey[flowKey].title}</p>
            <svg className="render-write-mode__svg-layer" width={px(instructions.width)} height={px(instructions.height)}>
                {instructions.entries.map((instruction: Instruction<any>) => {
                    switch (instruction.type) {
                        case InstructionType.path:
                            const path = instruction as PathInstruction;
                            const def = path.points.map((point, i) => {
                                return `${i === 0 ? 'M' : 'L'} ${px(point[0])} ${px(point[1])}`;
                            });
                            return <path key={path.key} fill="none" d={def.join(" ")} stroke={path.styles.color} strokeWidth={px(path.styles.thickness)} />
                        case InstructionType.circle:
                            const circle = instruction as CircleInstruction;
                            return <circle key={circle.key} style={{ transform: `translate(${px(circle.x)}px, ${px(circle.y)}px)` }} r={px(circle.radius)} fill={circle.styles.color} />
                        default:
                            return null;
                    }
                })}
            </svg>
            <div className="render-write-mode__text-layer">
                {instructions.entries.map((instruction: Instruction<any>) => {
                    switch (instruction.type) {
                        case InstructionType.text:
                            const text = instruction as TextInstruction;
                            return <Text key={text.key} style={{ transform: `translate(${px(text.x)}px, ${px(text.y)}px)`, fontFamily: text.styles.font, fontSize: px(text.styles.size), whiteSpace: 'pre', position: 'absolute', display: 'flex', alignItems: text.styles.align, justifyContent: text.styles.justify, height: 0, width: 0, lineHeight: '1em' }}>{text.value}</Text>;
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    </div>;
});

