import React from 'react';
import Toggle from './Toggle';

/**
 * Types
 */
export enum DurationUnitEnum {
  HOURS = 'Hours',
  DAYS = 'Days',
}

type UnitToggleProps = {
  onChange: (u: DurationUnitEnum) => void
};

/**
 * Component
 */
const UnitToggle: React.FunctionComponent<UnitToggleProps> = (props) => (
  <Toggle
    left="Hours"
    right="Days"
    rightTitle="Eight (8) hours are counted as one (1) day"
    onChange={(s) =>
      props.onChange(s === DurationUnitEnum.HOURS ? DurationUnitEnum.HOURS : DurationUnitEnum.DAYS)
    }
  />
);

export default UnitToggle;
