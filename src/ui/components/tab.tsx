import React, { FC, useCallback, useEffect, useRef, useMemo } from 'react';
import Color from 'color';

import './tab.css';

interface Props {
  value: any;

  // from parent <Tabs />
  selected?: boolean;
  background?: string;
  highlight?: string;
  onChange?: (value: any) => void;
  setBar?: (value: { left: number, width: number }) => void;
}

export const Tab: FC<Props> = ({ children, value, selected, background, highlight, onChange, setBar }) => {

  const ref = useRef<HTMLDivElement>(null);

  const text = useMemo(() => {
    if (selected) {
      return Color(highlight).isDark() ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
    } else {
      return Color(background).isDark() ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
    }
  }, [selected, background, highlight]);

  const _onClick = useCallback(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  useEffect(() => {
    if (setBar && selected && ref.current) {
      setBar({ left: ref.current.offsetLeft, width: ref.current.offsetWidth });
    }
  }, [selected, setBar]);

  return <div
    ref={ref}
    className="ui-tab"
    style={{
      color: text,
      transition: selected ? 'color .2s .1s' : 'color .2s'
    }}
    onClick={_onClick}
  >{children}</div>;
}