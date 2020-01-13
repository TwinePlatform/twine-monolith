import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { VolunteerProject } from '../../../../api/src/models/types'; // TODO
import API, { getErrorResponse } from '../../api'; // TODO
import {
  State,
  ProjectsState,
  RequestAction,
  SuccessAction,
  ErrorAction,
} from '../types'; // TODO


/*
 * Actions
 */
enum ActionsType {
 LOAD_PROJECTS_REQUEST = 'projects/LOAD_REQUEST',
 LOAD_PROJECTS_ERROR = 'projects/LOAD_ERROR',
 LOAD_PROJECTS_SUCCESS = 'projects/LOAD_SUCCESS',

 CREATE_PROJECT_REQUEST = 'project/CREATE_REQUEST',
 CREATE_PROJECT_ERROR = 'project/CREATE_ERROR',
 CREATE_PROJECT_SUCCESS = 'project/CREATE_SUCCESS',
 CREATE_PROJECT_RESET = 'project/CREATE_RESET',

 UPDATE_PROJECT_REQUEST = 'project/UPDATE_REQUEST',
 UPDATE_PROJECT_ERROR = 'project/UPDATE_ERROR',
 UPDATE_PROJECT_SUCCESS = 'project/UPDATE_SUCCESS',
 UPDATE_PROJECT_RESET = 'project/UPDATE_RESET',

 DELETE_PROJECT_REQUEST = 'project/DELETE_REQUEST',
 DELETE_PROJECT_ERROR = 'project/DELETE_ERROR',
 DELETE_PROJECT_SUCCESS = 'project/DELETE_SUCCESS',

 RESTORE_PROJECT_REQUEST = 'project/RESTORE_REQUEST',
 RESTORE_PROJECT_ERROR = 'project/RESTORE_ERROR',
 RESTORE_PROJECT_SUCCESS = 'project/RESTORE_SUCCESS',
}

/*
 * Types
 */
type LoadProjectsRequest = {
 type: ActionsType.LOAD_PROJECTS_REQUEST;
};

type LoadProjectsSuccess = {
 type: ActionsType.LOAD_PROJECTS_SUCCESS;
 payload: VolunteerProject []; // TODO
};

type LoadProjectsError = {
 type: ActionsType.LOAD_PROJECTS_ERROR;
 payload: Error;
};

type CreateProjectRequest = RequestAction<ActionsType.CREATE_PROJECT_REQUEST>
type CreateProjectSuccess = SuccessAction<ActionsType.CREATE_PROJECT_SUCCESS, VolunteerProject[]>
type CreateProjectError = ErrorAction<ActionsType.CREATE_PROJECT_ERROR>
type CreateProjectReset = RequestAction<ActionsType.CREATE_PROJECT_RESET>

type UpdateProjectRequest = RequestAction<ActionsType.UPDATE_PROJECT_REQUEST>
type UpdateProjectSuccess = SuccessAction<ActionsType.UPDATE_PROJECT_SUCCESS, VolunteerProject[]>
type UpdateProjectError = ErrorAction<ActionsType.UPDATE_PROJECT_ERROR>
type UpdateProjectReset = RequestAction<ActionsType.UPDATE_PROJECT_RESET>

type DeleteProjectRequest = RequestAction<ActionsType.DELETE_PROJECT_REQUEST>
type DeleteProjectSuccess = SuccessAction<ActionsType.DELETE_PROJECT_SUCCESS, VolunteerProject[]>
type DeleteProjectError = ErrorAction<ActionsType.DELETE_PROJECT_ERROR>

type RestoreProjectRequest = RequestAction<ActionsType.RESTORE_PROJECT_REQUEST>
type RestoreProjectSuccess = SuccessAction<ActionsType.RESTORE_PROJECT_SUCCESS, VolunteerProject[]>
type RestoreProjectError = ErrorAction<ActionsType.RESTORE_PROJECT_ERROR>

type Actions = LoadProjectsRequest | LoadProjectsError | LoadProjectsSuccess
  | CreateProjectRequest | CreateProjectSuccess | CreateProjectError | CreateProjectReset
  | UpdateProjectRequest | UpdateProjectSuccess | UpdateProjectError | UpdateProjectReset
  | DeleteProjectRequest | DeleteProjectSuccess | DeleteProjectError
  | RestoreProjectRequest | RestoreProjectSuccess | RestoreProjectError

/*
* Initial State
*/
const initialState: ProjectsState = {
  fetchError: null,
  isFetching: false,
  lastUpdated: null,
  items: {},
  order: [],
  createIsFetching: false,
  createSuccess: false,
  createError: null,
  updateIsFetching: false,
  updateError: null,
  updateSuccess: false,
  deleteIsFetching: false,
  deleteError: null,
};


/*
 * Action creators
 */
const loadProjectsRequest = createAction(ActionsType.LOAD_PROJECTS_REQUEST);
const loadProjectsError = createAction<Error>(ActionsType.LOAD_PROJECTS_ERROR);
const loadProjectsSuccess = createAction<Partial <VolunteerProject> []>(ActionsType.LOAD_PROJECTS_SUCCESS); // eslint-disable-line

const createProjectRequest = createAction(ActionsType.CREATE_PROJECT_REQUEST);
const createProjectSuccess = createAction(ActionsType.CREATE_PROJECT_SUCCESS);
const createProjectError = createAction<Error>(ActionsType.CREATE_PROJECT_ERROR);
export const createProjectReset = createAction(ActionsType.CREATE_PROJECT_RESET);

const updateProjectRequest = createAction(ActionsType.UPDATE_PROJECT_REQUEST);
const updateProjectSuccess = createAction(ActionsType.UPDATE_PROJECT_SUCCESS);
const updateProjectError = createAction<Error>(ActionsType.UPDATE_PROJECT_ERROR);
export const updateProjectReset = createAction(ActionsType.UPDATE_PROJECT_RESET);

const deleteProjectRequest = createAction(ActionsType.DELETE_PROJECT_REQUEST);
const deleteProjectSuccess = createAction(ActionsType.DELETE_PROJECT_SUCCESS);
const deleteProjectError = createAction<Error>(ActionsType.DELETE_PROJECT_ERROR);

const restoreProjectRequest = createAction(ActionsType.RESTORE_PROJECT_REQUEST);
const restoreProjectSuccess = createAction(ActionsType.RESTORE_PROJECT_SUCCESS);
const restoreProjectError = createAction<Error>(ActionsType.RESTORE_PROJECT_ERROR);

/*
 * Thunk creators
 */
export const loadProjects = () => (dispatch) => {
  dispatch(loadProjectsRequest());

  return API.Projects.get() // TODO
    .then((res) => dispatch(loadProjectsSuccess(res.data)))
    .catch((error) => dispatch(loadProjectsError(error)));
};

export const createProject = (newProject: Partial<VolunteerProject>) => (dispatch) => {
  dispatch(createProjectRequest());

  return API.Projects.add(newProject)
    .then(() => {
      dispatch(createProjectSuccess());
      dispatch(loadProjects());
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(createProjectError(errorResponse));
    });
};


export const updateProject = (changeset) => (dispatch) => {
  dispatch(updateProjectRequest());

  return API.Projects.update(changeset)
    .then(() => {
      dispatch(updateProjectSuccess());
      dispatch(loadProjects());
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(updateProjectError(errorResponse));
    });
};

export const deleteProject = (id: number) => (dispatch) => {
  dispatch(deleteProjectRequest());

  return API.Projects.delete(id)
    .then(() => {
      dispatch(deleteProjectSuccess());
      dispatch(loadProjects());
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(deleteProjectError(errorResponse));
    });
};

export const restoreProject = (id: number) => (dispatch) => {
  dispatch(restoreProjectRequest());

  return API.Projects.restore(id)
    .then(() => {
      dispatch(restoreProjectSuccess());
      dispatch(loadProjects());
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(restoreProjectError(errorResponse));
    });
};

/*
 * Reducer
 */
const projectsReducer: Reducer<ProjectsState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.LOAD_PROJECTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ActionsType.LOAD_PROJECTS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };

    case ActionsType.LOAD_PROJECTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetchError: null,
        lastUpdated: new Date(),
        order: action.payload.map((log) => log.id),
        items: action.payload.reduce((acc, x) => ({ ...acc, [x.id]: x }), {}),
      };

      // CREATE
    case ActionsType.CREATE_PROJECT_REQUEST:
      return {
        ...state,
        createIsFetching: true,
        createSuccess: false,
      };

    case ActionsType.CREATE_PROJECT_ERROR:
      return {
        ...state,
        createIsFetching: false,
        createSuccess: false,
        createError: action.payload,
      };

    case ActionsType.CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        createIsFetching: false,
        createSuccess: true,
        createError: null,
      };

    case ActionsType.CREATE_PROJECT_RESET:
      return {
        ...state,
        updateIsFetching: false,
        updateError: null,
        updateSuccess: false,
      };

    // UPDATE
    case ActionsType.UPDATE_PROJECT_REQUEST:
      return {
        ...state,
        updateIsFetching: true,
        updateSuccess: false,
      };

    case ActionsType.UPDATE_PROJECT_ERROR:
      return {
        ...state,
        updateIsFetching: false,
        updateError: action.payload,
        updateSuccess: false,
      };

    case ActionsType.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        updateIsFetching: false,
        updateError: null,
        updateSuccess: true,
      };

    case ActionsType.UPDATE_PROJECT_RESET:
      return {
        ...state,
        updateIsFetching: false,
        updateError: null,
        updateSuccess: false,
      };

    // DELETE
    case ActionsType.DELETE_PROJECT_REQUEST:
      return {
        ...state,
        deleteIsFetching: true,
      };

    case ActionsType.DELETE_PROJECT_ERROR:
      return {
        ...state,
        deleteIsFetching: false,
        deleteError: action.payload,
      };

    case ActionsType.DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        deleteIsFetching: false,
        deleteError: null,
      };

    // RESTORE
    case ActionsType.RESTORE_PROJECT_REQUEST:
      return {
        ...state,
        restoreIsFetching: true,
      };

    case ActionsType.RESTORE_PROJECT_ERROR:
      return {
        ...state,
        restoreIsFetching: false,
        restoreError: action.payload,
      };

    case ActionsType.RESTORE_PROJECT_SUCCESS:
      return {
        ...state,
        restoreIsFetching: false,
        restoreError: null,
      };
    default:
      return state;
  }
};


/*
 * Selectors
 */
export const selectOrderedProjects = (state: State) => state.entities.projects.order
  .map((id) => state.entities.projects.items[id]);

export const selectProjectsStatus = ({ entities: { projects } }: State) => (
  { isFetching: projects.isFetching, error: projects.fetchError }
);

export const selectCreateProjectStatus = ({ entities: { projects } }: State) => ({
  isFetching: projects.createIsFetching,
  error: projects.createError,
  success: projects.createSuccess,
});

export const selectUpdateProjectStatus = ({ entities: { projects } }: State) => ({
  isFetching: projects.updateIsFetching,
  error: projects.updateError,
  success: projects.updateSuccess,
});

export const selectDeleteProjectStatus = ({ entities: { projects } }: State) => (
  { isFetching: projects.deleteIsFetching, error: projects.deleteError }
);

export default projectsReducer;
