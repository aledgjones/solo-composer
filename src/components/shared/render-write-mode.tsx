import React, { FC, useState, useMemo } from 'react';
import Color from 'color';

import { Score } from '../../services/score';
import { THEME } from '../../const';
import { getWidthOfMM, getConverter } from '../../parse/converter';
import { defaultEngravingConfig } from '../../services/engraving';
import { getConvertedConfig } from '../../parse/get-converted-config';
import { parse } from '../../parse';
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

    const fg = useMemo(() => {
        return Color(THEME.primary).isDark() ? '#ffffff' : '#000000';
    }, []);

    const converter = useMemo(() => {
        const mm = getWidthOfMM();
        return getConverter(mm, score.engraving.score.space || defaultEngravingConfig.space);
    }, [score.engraving.score.space]);

    const instructions = useMemo(() => {
        const config = getConvertedConfig({ ...defaultEngravingConfig, ...score.engraving.score }, converter);
        return parse(score, flowKey, config, converter);
    }, [score, flowKey, converter]);

    const px = converter.spaces.toPX;

    return <div className="render-write-mode">
        <div className="render-write-mode__container" style={{ width: px(instructions.width), height: px(instructions.height) }}>
            <p className="render-write-mode__flow-name" style={{ color: fg, backgroundColor: THEME.primary }}>{score.flows.byKey[flowKey].title}</p>
            <svg className="render-write-mode__svg-layer" width={px(instructions.width)} height={px(instructions.height)}>
                {instructions.entries.map((instruction: Instruction<any>) => {
                    switch (instruction.type) {
                        case InstructionType.path:
                            const path = instruction as PathInstruction;
                            const def = path.points.map((point, i) => {
                                return `${i === 0 ? 'M' : 'L'} ${px(point[0])} ${px(point[1])}`;
                            });
                            return <path fill="none" d={def.join(" ")} stroke={path.styles.color} strokeWidth={px(path.styles.thickness)} />
                        case InstructionType.circle:
                            const circle = instruction as CircleInstruction;
                            return <circle cx={px(circle.x)} cy={px(circle.y)} r={px(circle.radius)} fill={circle.styles.color} />
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
                            return <Text style={{ fontFamily: text.styles.font, fontSize: px(text.styles.size), whiteSpace: 'pre', position: 'absolute', display: 'flex', alignItems: text.styles.align, justifyContent: text.styles.justify, height: 0, width: 0, left: px(text.x), top: px(text.y), lineHeight: '1em' }}>{text.value}</Text>;
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    </div>;
});

