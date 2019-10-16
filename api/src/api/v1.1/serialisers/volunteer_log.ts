import { assoc } from 'ramda';
import { VolunteerLog } from 'src/models';

export const defaultProjects = <T extends Partial<VolunteerLog>>(log: T) => {
  return log.project === null
    ? assoc('project', 'General', log)
    : log;
};
