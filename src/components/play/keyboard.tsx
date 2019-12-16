import React, { FC } from 'react';

import './keyboard.css';

interface Props {

}

export const Keyboard: FC<Props> = ({ }) => {
    const octave = 4;

    return <div className="keyboard">
        <p className="keyboard__name keyboard__name--1">C{octave + 1}</p>
        <p className="keyboard__name keyboard__name--2">C{octave}</p>
    </div>;
}

