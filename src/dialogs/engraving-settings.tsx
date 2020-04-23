import React, { FC, useState } from 'react';
import { THEME } from '../const';

import { Select, Option, Input, Button, Subheader, Switch, ListItem } from 'solo-ui';

import { MenuItem } from '../components/shared/menu-item';
import { EngravingState, LayoutType, PartialEngravingConfig, defaultEngravingConfig } from '../services/engraving';
import { BracketingType, BracketEndStyle } from '../parse/draw-brackets';

import staveSpace from '../assets/engraving/stave-space.svg';

import './generic-settings.css';
import { Label } from '../components/shared/label';

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

    const bg = THEME.primary[500];

    return <div className="generic-settings">
        <div className="generic-settings__content">

            <div className="generic-settings__left-panel">
                <MenuItem selected={page === Page.bracketsAndBraces} onClick={() => setPage(Page.bracketsAndBraces)}>Brackets &amp; Braces</MenuItem>
                <MenuItem selected={page === Page.staves} onClick={() => setPage(Page.staves)}>Staves</MenuItem>
            </div>

            <div className="generic-settings__right-panel">

                {page === Page.bracketsAndBraces && <>

                    <div className="generic-settings__section" style={{paddingBottom: 20}}>
                        <Subheader>Approach</Subheader>
                        <Select className="ui-select--margin" color={bg} label="Ensemble type" value={engraving.bracketing} onChange={(val: BracketingType) => onUpdate(key, { bracketing: val })}>
                            <Option value={BracketingType.none} displayAs="None">None</Option>
                            <Option value={BracketingType.orchestral} displayAs="Orchestral">Orchestral</Option>
                            <Option value={BracketingType.smallEnsemble} displayAs="Small ensemble">Small ensemble</Option>
                        </Select>
                    </div>
                    <ListItem onClick={() => onUpdate(key, { bracketSingleStaves: !engraving.bracketSingleStaves })}>
                        <Label>
                            <p>Bracket single instruments</p>
                            <p>Use a bracket for groups with only one instrument</p>
                        </Label>
                        <Switch color={THEME.primary[500]} value={engraving.bracketSingleStaves} />
                    </ListItem>
                    <ListItem style={{marginBottom: 20}} onClick={() => onUpdate(key, { subBracket: !engraving.subBracket })}>
                        <Label>
                            <p>Use sub-brackets</p>
                            <p>Bracket instruments of the same type</p>
                        </Label>
                        <Switch color={THEME.primary[500]} value={engraving.subBracket} />
                    </ListItem>

                    <div className="generic-settings__section">
                        <Subheader>Design</Subheader>
                        <Select color={bg} label="Bracket cap style" value={engraving.bracketEndStyle} onChange={(val: BracketEndStyle) => onUpdate(key, { bracketEndStyle: val })}>
                            <Option value={BracketEndStyle.none} displayAs="None">None</Option>
                            <Option value={BracketEndStyle.line} displayAs="Lines">Lines</Option>
                            <Option value={BracketEndStyle.wing} displayAs="Wings">Wings</Option>
                        </Select>
                    </div>

                </>}

                {page === Page.staves && <>

                    <div className="generic-settings__section">
                        <Subheader>Space Size</Subheader>
                        <div className="generic-settings__input-with-img">
                            <img alt="Stave spacing" src={staveSpace} className="generic-settings__example" />
                            <Input required type="number" label="Space size" value={engraving.space} precision={2} step={.01} units="mm" color={bg} onChange={(val: number) => onUpdate(key, { space: val })} />
                        </div>
                    </div>

                </>}

            </div>
        </div>

        <div className="generic-settings__buttons">
            <Select direction="up" style={{ width: 300, marginRight: 8 }} label="" value={key} color={bg} onChange={setKey}>
                <Option value={LayoutType.score} displayAs="Score">Score</Option>
                <Option value={LayoutType.part} displayAs="Part">Part</Option>
            </Select>
            <Button compact color={bg} outline>Reset All</Button>
            <div className="generic-settings__spacer" />
            <Button compact color={bg} onClick={onClose}>Close</Button>
        </div>
    </div>
}