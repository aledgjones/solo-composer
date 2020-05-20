import React, { useState } from "react";
import { Select, Option, Input, Button, Subheader, Switch, ListItem, Label, Dialog } from "solo-ui";

import { useAppActions, useAppState } from "../../services/state";
import { MenuItem } from "../../components/menu-item";
import { LayoutType, defaultEngravingConfig } from "../../services/engraving";
import { BracketingType, BracketEndStyle } from "../../parse/draw-brackets";

import staveSpace from "./examples/stave-space.svg";

import "../generic-settings.css";

enum Page {
    barlines,
    bracketsAndBraces,
    staves
}

interface Props {
    onClose: () => void;
}

export const EngraveSettings = Dialog<Props>(({ onClose }) => {

    const [page, setPage] = useState<Page>(Page.staves);
    const [layoutType, setLayoutType] = useState<LayoutType>(LayoutType.score);

    const actions = useAppActions();
    const { theme, config } = useAppState(s => {
        return {
            theme: s.ui.theme.pallets,
            config: s.score.engraving[layoutType]
        }
    }, [layoutType]);

    const engraving = {
        ...defaultEngravingConfig,
        ...config
    };

    return (
        <div className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <MenuItem color={theme.primary[500].bg} selected={page === Page.barlines} onClick={() => setPage(Page.barlines)}>
                        Barlines
                    </MenuItem>
                    <MenuItem color={theme.primary[500].bg} selected={page === Page.bracketsAndBraces} onClick={() => setPage(Page.bracketsAndBraces)}>
                        Brackets &amp; Braces
                    </MenuItem>
                    <MenuItem color={theme.primary[500].bg} selected={page === Page.staves} onClick={() => setPage(Page.staves)}>
                        Staves
                    </MenuItem>
                </div>

                <div className="generic-settings__right-panel">

                    {page === Page.barlines && (
                        <>
                            <div className="generic-settings__section">
                                <Subheader style={{ marginBottom: 0 }}>Systemic Barlines</Subheader>
                            </div>
                            <ListItem
                                style={{ marginBottom: 20 }}
                                onClick={() =>
                                    actions.score.engraving.set(layoutType, {
                                        systemicBarlineSingleInstrumentSystem: !engraving.systemicBarlineSingleInstrumentSystem
                                    })
                                }
                            >
                                <Label>
                                    <p>Use systemic barlines for single stave systems.</p>
                                    <p>Systemic barlines will always be used with multiple instruments.</p>
                                </Label>
                                <Switch color={theme.primary[500].bg} value={engraving.systemicBarlineSingleInstrumentSystem} />
                            </ListItem>
                        </>
                    )}


                    {page === Page.bracketsAndBraces && (
                        <>
                            <div
                                className="generic-settings__section"
                                style={{ paddingBottom: 20 }}
                            >
                                <Subheader>Approach</Subheader>
                                <Select
                                    className="ui-select--margin"
                                    color={theme.primary[500].bg}
                                    label="Ensemble type"
                                    value={engraving.bracketing}
                                    onChange={(val: BracketingType) =>
                                        actions.score.engraving.set(layoutType, { bracketing: val })
                                    }
                                >
                                    <Option value={BracketingType.none} displayAs="None">
                                        None
                                    </Option>
                                    <Option
                                        value={BracketingType.orchestral}
                                        displayAs="Orchestral"
                                    >
                                        Orchestral
                                    </Option>
                                    <Option
                                        value={BracketingType.smallEnsemble}
                                        displayAs="Small ensemble"
                                    >
                                        Small ensemble
                                    </Option>
                                </Select>
                            </div>
                            <ListItem
                                onClick={() =>
                                    actions.score.engraving.set(layoutType, {
                                        bracketSingleStaves: !engraving.bracketSingleStaves
                                    })
                                }
                            >
                                <Label>
                                    <p>Bracket single instruments.</p>
                                    <p>
                                        Use a bracket for isolated instruments of a particular
                                        instrument family.
                                    </p>
                                </Label>
                                <Switch
                                    color={theme.primary[500].bg}
                                    value={engraving.bracketSingleStaves}
                                />
                            </ListItem>
                            <ListItem
                                style={{ marginBottom: 20 }}
                                onClick={() =>
                                    actions.score.engraving.set(layoutType, {
                                        subBracket: !engraving.subBracket
                                    })
                                }
                            >
                                <Label>
                                    <p>Use sub-brackets.</p>
                                    <p>Bracket consecutive instruments of the same type.</p>
                                </Label>
                                <Switch color={theme.primary[500].bg} value={engraving.subBracket} />
                            </ListItem>

                            <div className="generic-settings__section">
                                <Subheader>Design</Subheader>
                                <Select
                                    color={theme.primary[500].bg}
                                    label="Bracket cap style"
                                    value={engraving.bracketEndStyle}
                                    onChange={(val: BracketEndStyle) =>
                                        actions.score.engraving.set(layoutType, {
                                            bracketEndStyle: val
                                        })
                                    }
                                >
                                    <Option value={BracketEndStyle.none} displayAs="None">
                                        None
                                    </Option>
                                    <Option value={BracketEndStyle.line} displayAs="Lines">
                                        Lines
                                    </Option>
                                    <Option value={BracketEndStyle.wing} displayAs="Wings">
                                        Wings
                                    </Option>
                                </Select>
                            </div>
                        </>
                    )}

                    {page === Page.staves && (
                        <>
                            <div className="generic-settings__section">
                                <Subheader>Space Size</Subheader>
                                <div className="generic-settings__input-with-img">
                                    <img
                                        alt="Stave spacing"
                                        src={staveSpace}
                                        className="generic-settings__example"
                                    />
                                    <Input
                                        required
                                        type="number"
                                        label="Space size"
                                        value={engraving.space}
                                        precision={2}
                                        step={0.01}
                                        units="mm"
                                        color={theme.primary[500].bg}
                                        onChange={(val: number) =>
                                            actions.score.engraving.set(layoutType, { space: val })
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="generic-settings__buttons">
                <Select
                    direction="up"
                    style={{ width: 300, marginRight: 8 }}
                    label=""
                    value={layoutType}
                    color={theme.primary[500].bg}
                    onChange={setLayoutType}
                >
                    <Option value={LayoutType.score} displayAs="Score">
                        Score
                    </Option>
                    <Option value={LayoutType.part} displayAs="Part">
                        Part
                    </Option>
                </Select>
                <Button compact color={theme.primary[500].bg} outline>
                    Reset All
                </Button>
                <div className="generic-settings__spacer" />
                <Button compact color={theme.primary[500].bg} onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
});
