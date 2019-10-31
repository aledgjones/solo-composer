import React, { FC } from "react";

interface Props {
    value: any;
    displayAs: string;
}

export const Option: FC<Props> = ({ children }) => {
    return <>{children ? children : null}</>;
}