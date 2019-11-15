import React from 'react';
import styled from 'styled-components';
import Toggle from './Toggle';
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
type ProjectOrActivity = 'Projects' | 'Activities';
type ProjectActivityToggleProps = {
  active: ProjectOrActivity
  onChange: (u: ProjectOrActivity) => void
};


/**
 * Component
 */
const ProjectActivityToggle: React.FunctionComponent<ProjectActivityToggleProps> = ({ active, onChange, ...rest }) => (
  <>
    <Span>Group by:</Span>
    <Info title="Choose whether to group time by projects or activities" />
    <Toggle
      {...rest}
      left="Projects"
      right="Activities"
      active={active === 'Projects' ? 'left' : 'right'}
      onChange={(s) => onChange(s === 'Projects' ? 'Projects' : 'Activities')}
    />
  </>
);

export default ProjectActivityToggle;
