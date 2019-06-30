import React, { useContext } from 'react';
import Toggle, { Side } from './Toggle';
import { DurationUnitEnum } from '../../../types';
import { DashboardContext } from '../../../App';

/**
 * Types
 */

type UnitToggleProps = {
  onChange: (u: DurationUnitEnum) => void
};

/**
 * Component
 */
const UnitToggle: React.FunctionComponent<UnitToggleProps> = (props) => {
  const { unit } = useContext(DashboardContext);
  const active: Side = unit === DurationUnitEnum.HOURS ? 'left' : 'right';
  return (
  <Toggle
    left="Hours"
    right="Days"
    rightTitle="Eight (8) hours are counted as one (1) day"
    active={active}
    onChange={(s) =>
      props.onChange(s === DurationUnitEnum.HOURS ? DurationUnitEnum.HOURS : DurationUnitEnum.DAYS)
    }
  />
  );
};

export default UnitToggle;
