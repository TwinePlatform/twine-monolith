import { assoc } from 'ramda';
import { VolunteerLog } from 'src/models';

export const defaultProjects = <T extends Partial<VolunteerLog>>(log: T) => {
  return log.project
    ? log
    : assoc('project', 'General', log)
};
