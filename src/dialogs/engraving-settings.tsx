import React, { FC, useState } from 'react';
import { THEME } from '../const';

import { Backdrop, Card, Select, Option, InputNumber, Button } from '../ui';
import { ListItem } from '../components/shared/list-item';
import { EngravingState, LayoutType, PartialEngravingConfig, defaultEngravingConfig } from '../services/engraving';
import { BracketingType, BracketEndStyle } from '../parse/draw-brackets';
import { DialogHeader } from './dialog-header';

import staveSpace from '../assets/engraving/stave-space.svg';

import './generic-settings.css';
import './engraving-settings.css';

enum Page {
    staves = 1,
    bracketsAndBraces
}

interface Props {
    config: EngravingState;

    onClose: () => void;
    onUpdate: (layout: LayoutType, instruction: PartialEngravingConfig) => void;
}

export const EngravingSettings: FC<Props> = ({ config, onUpdate, onClose }) => {

    const [page, setPage] = useState<Page>(Page.staves);
    const [key, setKey] = useState<LayoutType>(LayoutType.score);

    const engraving = {
        ...defaultEngravingConfig,
        ...config[key]
    }

    const bg = THEME.primary[500].bg;

    return <Backdrop visible={true}>
        <Card animate className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <ListItem selected={page === Page.bracketsAndBraces} onClick={() => setPage(Page.bracketsAndBraces)}>Brackets &amp; Braces</ListItem>
                    <ListItem selected={page === Page.staves} onClick={() => setPage(Page.staves)}>Staves</ListItem>
                </div>
                <div className="generic-settings__right-panel">

                    {page === Page.bracketsAndBraces && <>
                        <div className="generic-settings__group">
                            <DialogHeader>Approach</DialogHeader>
                            <div className="generic-settings__section">
                                <Select margin required color={bg} label="Ensemble type" value={engraving.bracketing} onChange={(val: BracketingType) => onUpdate(key, { bracketing: val })}>
                                    <Option value={BracketingType.none} displayAs="None">None</Option>
                                    <Option value={BracketingType.orchestral} displayAs="Orchestral">Orchestral</Option>
                                    <Option value={BracketingType.smallEnsemble} displayAs="Small ensemble">Small ensemble</Option>
                                </Select>
                                <Select margin required color={bg} label="Bracket groups with only one instrument" value={engraving.bracketSingleStaves} onChange={(val: boolean) => onUpdate(key, { bracketSingleStaves: val })}>
                                    <Option value={true} displayAs="Use bracket">Use bracket</Option>
                                    <Option value={false} displayAs="No bracket">No bracket</Option>
                                </Select>
                                <Select required color={bg} label="Sub bracket instruments of the same type" value={engraving.subBracket} onChange={(val: boolean) => onUpdate(key, { subBracket: val })}>
                                    <Option value={true} displayAs="Use sub brackets">Use sub brackets</Option>
                                    <Option value={false} displayAs="No sub brackets">No sub brackets</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="generic-settings__group">
                            <DialogHeader>Design</DialogHeader>
                            <div className="generic-settings__section">
                                <Select required color={bg} label="Bracet cap style" value={engraving.bracketEndStyle} onChange={(val: BracketEndStyle) => onUpdate(key, { bracketEndStyle: val })}>
                                    <Option value={BracketEndStyle.none} displayAs="None">None</Option>
                                    <Option value={BracketEndStyle.line} displayAs="Lines">Lines</Option>
                                    <Option value={BracketEndStyle.wing} displayAs="Wings">Wings</Option>
                                </Select>
                            </div>
                        </div>
                    </>}

                    {page === Page.staves && <>
                        <div className="generic-settings__group">
                            <DialogHeader>Space Size</DialogHeader>
                            <div className="generic-settings__section">
                                <img alt="Stave spacing" src={staveSpace} className="generic-settings__example" />
                                <InputNumber label="Space size" value={engraving.space} precision={2} step={.01} units="mm" color={bg} errorColor={THEME.error[500].bg} onChange={(val: number) => onUpdate(key, { space: val })} />
                            </div>
                        </div>
                    </>}

                    {/* {page === Page.staffLabels && <>
                        <div className="generic-settings__header">Numbering</div>
                        <div className="generic-settings__section">
                            <Select required color={color} placeholder="Numbering Style" value={config.autoCountStyle} onChange={(val: InstrumentAutoCountStyle) => onUpdate(key, { autoCountStyle: val })}>
                                <Option value={InstrumentAutoCountStyle.arabic} displayAs="Arabic Numbering (1, 2, 3 etc.)">Arabic Numbering (1, 2, 3 etc.)</Option>
                                <Option value={InstrumentAutoCountStyle.roman} displayAs="Roman Numbering (I, II, III etc.)">Roman Numbering (I, II, III etc.)</Option>
                            </Select>
                        </div>
                    </>} */}

                </div>
            </div>
            <div className="generic-settings__buttons">
                <Select style={{ width: 300, marginRight: 8 }} required value={key} color={bg} onChange={setKey}>
                    <Option value={LayoutType.score} displayAs="Score">Score</Option>
                    <Option value={LayoutType.part} displayAs="Part">Part</Option>
                </Select>
                <Button compact color={bg} outline>Reset All</Button>
                <div className="generic-settings__spacer" />
                <Button compact color={bg} onClick={onClose}>Close</Button>
            </div>
        </Card>
    </Backdrop>;
}