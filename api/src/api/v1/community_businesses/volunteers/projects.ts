import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { response, id, since, until, volunteerProject } from '../schema';
import { VolunteerProjects } from '../../../../models';
import { getCommunityBusiness } from '../../prerequisites';
import { Api } from '../../types/api';


const routes: [
  Api.CommunityBusinesses.Me.Volunteers.Projects.GET.Route,
  Api.CommunityBusinesses.Me.Volunteers.Projects.POST.Route,
  Api.CommunityBusinesses.Me.Volunteers.Projects.Id.GET.Route,
  Api.CommunityBusinesses.Me.Volunteers.Projects.Id.PUT.Route,
  Api.CommunityBusinesses.Me.Volunteers.Projects.Id.DELETE.Route,
] = [
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
    handler: async (request, h) => {
      const { server: { app: { knex } }, pre: { communityBusiness } } = request;

      return VolunteerProjects.fromCommunityBusiness(knex, communityBusiness);
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
          name: volunteerProject.required(),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        payload: { name },
        pre: { communityBusiness },
      } = request;

      try {
        // Need to await to allow catching thrown exceptions
        const project = await VolunteerProjects.add(knex, communityBusiness, name);
        return project;
      } catch (error) {
        if (error.message === 'Cannot add duplicate project') {
          return Boom.conflict(error.message);
        }
        throw error;
      }
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
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        params: { projectId },
        pre: { communityBusiness },
      } = request;

      const projects = await VolunteerProjects.fromCommunityBusiness(knex, communityBusiness);
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
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        params: { projectId },
        payload,
        pre: { communityBusiness },
      } = request;

      const projects = await VolunteerProjects.fromCommunityBusiness(knex, communityBusiness);
      const project = projects.find((p) => p.id === Number(projectId));

      if (!project) {
        return Boom.notFound('No project with this ID found under this organisation');
      }

      try {
        const [log] = await VolunteerProjects.update(knex, project, payload);
        return log;
      } catch (error) {
        if (error.message === 'Project name is a duplicate') {
          return Boom.conflict(error.message);
        }
        throw error;
      }
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
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        params: { projectId },
        pre: { communityBusiness },
      } = request;

      const projects = await VolunteerProjects.fromCommunityBusiness(knex, communityBusiness);
      const project = projects.find((p) => p.id === Number(projectId));

      if (!project) {
        return Boom.notFound('No project found with this ID under this organisation');
      }

      await VolunteerProjects.delete(knex, project);

      return null;
    },
  },
];

export default routes;
