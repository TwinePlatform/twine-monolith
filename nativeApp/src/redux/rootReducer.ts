import { combineReducers } from 'redux';
import logsReducer from './entities/logs';
import volunteersReducer from './entities/volunteers';
import currentUserReducer from './currentUser';
import projectsReducer from './entities/projects';
import activitiesReducer from './constants/activities';
import gendersReducer from './constants/genders';
import birthYearsReducer from './constants/birthYears';

// General idea is to keep state in a "normalised" structure
// (see https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape)
// This means keeping model data (entities) well organised and separate from other system/ui state
export default combineReducers({
  currentUser: currentUserReducer,
  entities: combineReducers({
    logs: logsReducer,
    volunteers: volunteersReducer,
    projects: projectsReducer,
  }),
  constants: combineReducers({
    activities: activitiesReducer,
    genders: gendersReducer,
    birthYears: birthYearsReducer,
  }),
});
