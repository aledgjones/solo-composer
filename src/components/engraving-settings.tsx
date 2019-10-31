import React, { FC, useState } from 'react';
import { Theme } from '../const';

import { EngravingState, LayoutType, PartialEngravingConfig, defaultEngravingConfig } from '../services/engraving';
import { BracketingType, BracketEndStyle } from '../services/render/draw-brackets';
import { ListItem } from './list-item';

import { Card } from '../ui/components/card';
import { Backdrop } from '../ui/components/backdrop';
import { Button } from '../ui';
import { Select } from '../ui/components/select';
import { Option } from '../ui/components/option';
import { InputNumber } from '../ui/components/input-number';

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

    return <Backdrop visible={true}>
        <Card animate className="general-settings">
            <div className="general-settings__content">
                <div className="general-settings__left-panel">
                    <ListItem selected={page === Page.bracketsAndBraces} onClick={() => setPage(Page.bracketsAndBraces)}>Brackets &amp; Braces</ListItem>
                    <ListItem selected={page === Page.staves} onClick={() => setPage(Page.staves)}>Staves</ListItem>
                </div>
                <div className="general-settings__right-panel">

                    {page === Page.bracketsAndBraces && <>
                        <div className="general-settings__header">Approach</div>
                        <div className="general-settings__section">
                            <Select margin required color={Theme.primary} label="Ensemble type" value={engraving.bracketing} onChange={(val: BracketingType) => onUpdate(key, { bracketing: val })}>
                                <Option value={BracketingType.none} displayAs="None">None</Option>
                                <Option value={BracketingType.smallEnsemble} displayAs="Small ensemble">Small ensemble</Option>
                                <Option value={BracketingType.orchestral} displayAs="Orchestral">Orchestral</Option>
                            </Select>
                            <Select required color={Theme.primary} label="Bracket groups with only one instrument" value={engraving.bracketSingleStaves} onChange={(val: boolean) => onUpdate(key, { bracketSingleStaves: val })}>
                                <Option value={true} displayAs="Use bracket">Use bracket</Option>
                                <Option value={false} displayAs="No bracket">No bracket</Option>
                            </Select>
                        </div>
                        <div className="general-settings__header">Design</div>
                        <div className="general-settings__section">
                            <Select margin required color={Theme.primary} label="Bracet style" value={engraving.bracketEndStyle} onChange={(val: BracketEndStyle) => onUpdate(key, { bracketEndStyle: val })}>
                                <Option value={BracketEndStyle.none} displayAs="None">None</Option>
                                <Option value={BracketEndStyle.line} displayAs="Lines">Lines</Option>
                                <Option value={BracketEndStyle.wing} displayAs="Wings">Wings</Option>
                            </Select>
                        </div>
                    </>}

                    {page === Page.staves && <>
                        <div className="general-settings__header">Space Size</div>
                        <div className="general-settings__section">
                            <InputNumber label="Space size" value={engraving.space} precision={2} step={.05} units="mm" color={Theme.primary} errorColor={Theme.error} onChange={(val: number) => onUpdate(key, { space: val })} />
                        </div>
                    </>}

                    {/* {page === Page.staffLabels && <>
                        <div className="general-settings__header">Numbering</div>
                        <div className="general-settings__section">
                            <Select required color={color} placeholder="Numbering Style" value={config.autoCountStyle} onChange={(val: InstrumentAutoCountStyle) => onUpdate(key, { autoCountStyle: val })}>
                                <Option value={InstrumentAutoCountStyle.arabic} displayAs="Arabic Numbering (1, 2, 3 etc.)">Arabic Numbering (1, 2, 3 etc.)</Option>
                                <Option value={InstrumentAutoCountStyle.roman} displayAs="Roman Numbering (I, II, III etc.)">Roman Numbering (I, II, III etc.)</Option>
                            </Select>
                        </div>
                    </>} */}

                </div>
            </div>
            <div className="general-settings__buttons">
                <Select style={{ width: 300, marginRight: 8 }} required value={key} color={Theme.primary} onChange={setKey}>
                    <Option value={LayoutType.score} displayAs="Score">Score</Option>
                    <Option value={LayoutType.part} displayAs="Part">Part</Option>
                </Select>
                <Button compact color={Theme.primary} outline>Reset All</Button>
                <div className="general-settings__spacer" />
                <Button compact color={Theme.primary} onClick={onClose}>Close</Button>
            </div>
        </Card>
    </Backdrop>;
}