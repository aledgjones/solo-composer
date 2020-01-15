import React, { FC, cloneElement, Children, useState } from 'react';
import { merge } from '../utils/merge';

import './tabs.css';

interface Props {
  value: any;
  onChange: (value: any) => void;

  background: string;
  highlight: string;
  className?: string;
}

export const Tabs: FC<Props> = ({ children, value, onChange, background, highlight, className }) => {

  const [bar, setBar] = useState<{ left: 0, width: 90 }>({ left: 0, width: 90 });

  return <div className={merge("ui-tabs", className)} style={{ backgroundColor: background }}>
    {Children.map(children, (child: any) => {
      return cloneElement(child, { onChange, setBar, background, highlight, selected: value === child.props.value });
    })}
    <div className="ui-tabs__bar" style={{ backgroundColor: highlight, ...bar }} />
  </div>;
}