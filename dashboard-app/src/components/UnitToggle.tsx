import React from 'react';
import Toggle from './Toggle';


type DurationUnit = 'Hours' | 'Days';

type UnitToggleProps = {
  onChange: (u: DurationUnit) => void
};

const UnitToggle: React.FunctionComponent<UnitToggleProps> = (props) => (
  <Toggle
    left="Hours"
    right="Days"
    rightTitle="Eight (8) hours are counted as one (1) day"
    onChange={(s) => props.onChange(s === 'Hours' ? 'Hours' : 'Days')}
  />
);

export default UnitToggle;
