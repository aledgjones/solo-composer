import React, { FC, CSSProperties } from "react";
import { Spinner, Label, Icon } from "solo-ui";
import { mdiEyeOffOutline } from "@mdi/js";

interface Props {
    style?: CSSProperties;
    type: "loading" | "empty";
    color: string
    text?: string;
    subtext?: string;
}

export const Fallback: FC<Props> = ({ style, type, color, text, subtext }) => {
    return (
        <div
            className="fallback"
            style={{
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                ...style
            }}
        >
            {type === "loading" && <Spinner color={color} size={24} />}
            {type === "empty" && (
                <>
                    <Icon path={mdiEyeOffOutline} color={color} size={48} style={{ marginBottom: 10 }} />
                    <Label style={{ color, textAlign: "center" }}>
                        <p>{text || 'Nothing to see here'}</p>
                        <p>{subtext || "I haven't done this bit yet... shucks!"}</p>
                    </Label>
                </>
            )}
        </div>
    );
};
