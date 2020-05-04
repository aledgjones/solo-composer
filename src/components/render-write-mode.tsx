import React, { FC, useState, memo } from "react";

import { useForeground } from "solo-ui";

import { useAppState } from "../services/state";
import { THEME } from "../const";
import { useParseWorker } from "../parse/use-parse";
import { Instruction, InstructionType } from "../render/instructions";
import { PathInstruction } from "../render/path";
import { TextInstruction } from "../render/text";
import { CircleInstruction } from "../render/circle";
import { CurveInstruction, getControlPoints } from "../render/curve";
import { Text } from "./text";

import "./render-write-mode.css";

export const RenderWriteMode: FC = memo(() => {
    const score = useAppState(s => s.score);

    const bg = THEME.primary[500];
    const fg = useForeground(bg);

    const [flowKey] = useState(score.flows.order[0]);
    const instructions = useParseWorker(score, flowKey);

    if (!instructions) {
        return null;
    }

    const { space, width, height, entries } = instructions;

    return (
        <div className="render-write-mode">
            <div
                className="render-write-mode__container"
                style={{ width: width * space, height: height * space }}
            >
                <p
                    className="render-write-mode__flow-name"
                    style={{ color: fg, backgroundColor: bg }}
                >
                    {score.flows.byKey[flowKey].title}
                </p>
                <svg className="render-write-mode__svg-layer">
                    {entries.map((instruction: Instruction<any>) => {
                        switch (instruction.type) {
                            case InstructionType.path: {
                                const path = instruction as PathInstruction;
                                const def = path.points.map((point, i) => {
                                    return `${i === 0 ? "M" : "L"} ${point[0] * space} ${point[1] *
                                        space}`;
                                });
                                return (
                                    <path
                                        key={path.key}
                                        fill="none"
                                        d={def.join(" ")}
                                        stroke={path.styles.color}
                                        strokeWidth={path.styles.thickness * space}
                                    />
                                );
                            }
                            case InstructionType.circle: {
                                const circle = instruction as CircleInstruction;
                                return (
                                    <circle
                                        key={circle.key}
                                        cx={circle.x * space}
                                        cy={circle.y * space}
                                        r={circle.radius * space}
                                        fill={circle.styles.color}
                                    />
                                );
                            }
                            case InstructionType.text: {
                                const text = instruction as TextInstruction;
                                return (
                                    <foreignObject
                                        className="render-write-mode__entry--text"
                                        key={text.key}
                                        x={text.x * space}
                                        y={text.y * space}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: text.styles.font,
                                                fontSize: text.styles.size * space,
                                                alignItems: text.styles.align,
                                                justifyContent: text.styles.justify
                                            }}
                                        >
                                            {text.value}
                                        </Text>
                                    </foreignObject>
                                );
                            }
                            case InstructionType.curve: {
                                const curve = instruction as CurveInstruction;
                                const def: string[] = [];

                                const points = getControlPoints(
                                    curve.points[0],
                                    curve.points[1],
                                    curve.points[2]
                                );
                                const [P0, P1, P2, P3, P4, P5] = points;

                                def.push(`M ${P0.x * space} ${P0.y * space}`);
                                def.push(
                                    `Q ${P1.x * space} ${P1.y * space}, ${P2.x * space} ${P2.y *
                                        space}`
                                );
                                def.push(`L ${P3.x * space} ${P3.y * space}`);
                                def.push(
                                    `Q ${P4.x * space} ${P4.y * space}, ${P5.x * space} ${P5.y *
                                        space}`
                                );

                                return (
                                    <path
                                        key={curve.key}
                                        fill={curve.styles.color}
                                        d={def.join(" ")}
                                    />
                                );

                                // DEBUG
                                // return <>
                                //     <path key={curve.key} fill={curve.styles.color} d={def.join(" ")} />
                                //     {curve.points.map(point => {
                                //         return <circle style={{ zIndex: 1000 }} cx={point.x * space} cy={point.y * space} r={0.25 * space} fill="green" />
                                //     })}
                                //     {points.map(point => {
                                //         return <circle style={{ zIndex: 1000 }} cx={point.x * space} cy={point.y * space} r={0.25 * space} fill="red" />
                                //     })}
                                // </>
                            }
                            default:
                                return null;
                        }
                    })}
                </svg>
            </div>
        </div>
    );
});
