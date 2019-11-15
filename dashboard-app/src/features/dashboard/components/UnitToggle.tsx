import React, { useContext } from 'react';
import styled from 'styled-components';
import Toggle, { Side } from './Toggle';
import { DurationUnitEnum } from '../../../types';
import { DashboardContext } from '../context';
import { Span as _Span } from '../../../lib/ui/components/Typography';
import Info from './InfoTag';


/**
 * Styles
 */
const Span = styled(_Span)`
  margin: 0 1rem;
`;


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
    <>
      <Span>Unit:</Span>
      <Info title="Eight (8) hours are counted as one (1) day" />
      <Toggle
        left="Hours"
        right="Days"
        rightTitle="Eight (8) hours are counted as one (1) day"
        active={active}
        onChange={(s) =>
          props.onChange(s === DurationUnitEnum.HOURS ? DurationUnitEnum.HOURS : DurationUnitEnum.DAYS)
        }
      />
    </>
  );
};

export default UnitToggle;
