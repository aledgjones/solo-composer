import React, { FC } from 'react';
import { Spinner, useForeground } from 'solo-ui';
import { THEME } from '../../const';
import { Label } from '../label';

export const Fallback: FC<{ type: 'loading' | 'empty' }> = ({ type }) => {

    const bg = THEME.grey[500];
    const fg = useForeground(bg);

    return <div className="fallback" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', backgroundColor: THEME.grey[500] }}>
        {type === 'loading' && <Spinner color={fg} size={24} />}
        {type === 'empty' && <Label style={{color: '#ffffff', textAlign: 'center'}}>
            <p>Nothing to see here</p>
            <p>I haven't done this bit yet... shucks!</p>
        </Label>}
    </div>
}