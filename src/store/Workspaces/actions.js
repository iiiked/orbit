import { push } from 'react-router-redux';

import * as types from './actionTypes';
import * as utils from '../../utils';

import WorkspaceService from '../../services/workspaces.service';

// instantiate the Workspace service
const workspaceService = WorkspaceService();

/** Workspaces Actions */

export const getWorkspaces = () => async (dispatch) => {
  try {
    dispatch({ type: types.WORKSPACES_FETCHED });


    const data = await workspaceService.fetchWorkspaces();

    if (!data) {
      throw new Error('Workspaces fetch request failed');
    }

    // normalise workspaces
    const workspacesById = utils.keyById(data, '_id');

    dispatch({ type: types.WORKSPACES_FETCHED_SUCCESS, workspacesById });
  } catch (err) {
    dispatch({
      type: types.WORKSPACES_FETCHED_FAILURE,
      error: err,
    });
  }
};

export const addWorkspace = data => async (dispatch) => {
  try {
    dispatch({ type: types.WORKSPACES_ADD });

    const workspace = await workspaceService.createWorkspace(data);

    const { errors, _id } = workspace;

    if (errors) {
      throw new Error('Workspace already exists, choose a different name to create one.');
    }

    // normalise
    const workspaceById = utils.keyById([workspace], '_id');

    dispatch({ type: types.WORKSPACES_ADD_SUCCESS, workspaceById });
    dispatch(push(`/workspace/${_id}`));
  } catch (err) {
    dispatch({
      type: types.WORKSPACES_ADD_FAILURE,
      error: err,
    });
    dispatch(push('/dashboard'));
  }
};

export const deleteWorkspace = id => async (dispatch) => {
  try {
    dispatch({ type: types.WORKSPACES_DELETE });

    const response = await workspaceService.deleteWorkspace(id);

    if (!response.ok) {
      throw new Error('Failed to delete workspace');
    }

    dispatch({ type: types.WORKSPACES_DELETE_SUCCESS, id });
  } catch (err) {
    dispatch({ type: types.WORKSPACES_ADD_FAILURE, error: err });
  }
};
