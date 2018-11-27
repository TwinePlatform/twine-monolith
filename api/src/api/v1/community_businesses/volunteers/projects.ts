import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { response, id, since, until } from '../schema';
import { VolunteerLogs } from '../../../../models';
import { getCommunityBusiness } from '../../prerequisites';
import {
  GetMyVolunteerProjectRequest,
  PostMyVolunteerProjectRequest,
  PutMyVolunteerProjectRequest,
} from '../../types';


const routes: Hapi.ServerRoute[] = [

  {
    method: 'GET',
    path: '/community-businesses/me/volunteers/projects',
    options: {
      description: 'Retrieve volunteer projects for own community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: [
            'organisations_volunteers-parent:read',
            'organisations_volunteers-own:read',
          ],
        },
      },
      validate: { query: { since, until } },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetMyVolunteerProjectRequest, h) => {
      const { server: { app: { knex } }, pre: { communityBusiness } } = request;

      return VolunteerLogs.getProjects(knex, communityBusiness);
    },
  },

  {
    method: 'POST',
    path: '/community-businesses/me/volunteers/projects',
    options: {
      description: 'Create volunteer project for own community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: [
            'organisations_volunteers-parent:write',
            'organisations_volunteers-own:write',
          ],
        },
      },
      validate: {
        payload: {
          name: Joi.string().min(2).max(255).required(),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: PostMyVolunteerProjectRequest, h) => {
      const {
        server: { app: { knex } },
        payload: { name },
        pre: { communityBusiness },
      } = request;

      return VolunteerLogs.addProject(knex, communityBusiness, name);
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/me/volunteers/projects/{projectId}',
    options: {
      description: 'Retrieve single volunteer project',
      auth: {
        strategy: 'standard',
        access: {
          scope: [
            'organisations_volunteers-parent:read',
            'organisations_volunteers-own:read',

          ],
        },
      },
      validate: {
        params: { projectId: id.required() },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetMyVolunteerProjectRequest, h) => {
      const {
        server: { app: { knex } },
        params: { projectId },
        pre: { communityBusiness },
      } = request;

      const projects = await VolunteerLogs.getProjects(knex, communityBusiness);
      const project = projects.find((p) => p.id === Number(projectId));

      if (!project) {
        return Boom.notFound('No project found with this ID under this organisation');
      }

      return project;
    },
  },

  {
    method: 'PUT',
    path: '/community-businesses/me/volunteers/projects/{projectId}',
    options: {
      description: 'Update volunteer logs for own community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: [
            'organisations_volunteers-parent:write',
            'organisations_volunteers-own:write',
          ],
        },
      },
      validate: {
        params: {
          projectId: id.required(),
        },
        payload: {
          name: Joi.string().min(2).max(255).required(),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: PutMyVolunteerProjectRequest, h) => {
      const {
        server: { app: { knex } },
        params: { projectId },
        payload,
        pre: { communityBusiness },
      } = request;

      const projects = await VolunteerLogs.getProjects(knex, communityBusiness);
      const project = projects.find((p) => p.id === Number(projectId));

      if (!project) {
        return Boom.notFound('No project with this ID found under this organisation');
      }

      const [log] = await VolunteerLogs.updateProject(knex, project, payload);

      return log;
    },
  },

  {
    method: 'DELETE',
    path: '/community-businesses/me/volunteers/projects/{projectId}',
    options: {
      description: 'Mark volunteer logs for own community business as deleted',
      auth: {
        strategy: 'standard',
        access: {
          scope: [
            'organisations_volunteers-parent:delete',
            'organisations_volunteers-own:delete',
          ],
        },
      },
      validate: {
        params: { projectId: id },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetMyVolunteerProjectRequest, h) => {
      const {
        server: { app: { knex } },
        params: { projectId },
        pre: { communityBusiness },
      } = request;

      const projects = await VolunteerLogs.getProjects(knex, communityBusiness);
      const project = projects.find((p) => p.id === Number(projectId));

      if (!project) {
        return Boom.notFound('No project found with this ID under this organisation');
      }

      await VolunteerLogs.deleteProject(knex, project);

      return null;
    },
  },

];

export default routes;
