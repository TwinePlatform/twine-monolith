import React from 'react';
import Toggle from './Toggle';


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
  <Toggle
    {...rest}
    left="Projects"
    right="Activities"
    active={active === 'Projects' ? 'left' : 'right'}
    onChange={(s) => onChange(s === 'Projects' ? 'Projects' : 'Activities')}
  />
);

export default ProjectActivityToggle;
