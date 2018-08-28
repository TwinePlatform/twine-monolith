import * as Hapi from 'hapi';
import { CommunityBusinesses } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import {
  query,
  response,
  visitActivitiesPostQuery,
  visitActivitiesPutQuery,
  id,
  meOrId } from './schema';
import { VisitActivity } from '../../../models/types';

interface PostOrPutRequest extends Hapi.Request {
  payload: Partial<VisitActivity>;
}

export default [
  {
    method: 'GET',
    path: '/community-businesses/{communityBusinessId}/visit_activities',
    options: {
      description: 'Retrieve all visit activities for a community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: [
            'visit_activities-own:read',
            'visit_activities-child:read',
            'visit_activties-parent:read',
          ],
        },
      },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
      validate: {
        query,
        params: { communityBusinessId: meOrId },
      },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { knex, pre: { communityBusiness } } = request;
      return CommunityBusinesses.getVisitActivities(knex, communityBusiness);
    },
  },
  {
    method: 'POST',
    path: '/community-businesses/{communityBusinessId}/visit_activities',
    options: {
      description: 'Retrieve all visit activities for a community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['visit_activities-own:write'],
        },
      },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
      validate: {
        payload: visitActivitiesPostQuery,
        params: { communityBusinessId: meOrId },
      },
      response: { schema: response },
    },
    handler: async (request: PostOrPutRequest, h: Hapi.ResponseToolkit) => {
      const { knex, payload: visitActivity, pre: { communityBusiness } } = request;
      return CommunityBusinesses.addVisitActivity(knex, visitActivity, communityBusiness);
    },
  },
  {
    method: 'PUT',
    path: '/community-businesses/{communityBusinessId}/visit_activities/{visitActivityId}',
    options: {
      description: 'Retrieve all visit activities for a community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['visit_activities-own:write'],
        },
      },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
      validate: { payload: visitActivitiesPutQuery },
      response: { schema: response },
    },
    handler: async (request: PostOrPutRequest, h: Hapi.ResponseToolkit) => {
      const { knex, pre: { communityBusiness }, params: { visitActivityId }, payload } = request;

      return CommunityBusinesses.updateVisitActivity(knex, payload);
    },
  },
  {
    method: 'DELETE',
    path: '/community-businesses/{communityBusinessId}/visit_activities/{visitActivityId}',
    options: {
      description: 'Retrieve all visit activities for a community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['visit_activities-own:delete'],
        },
      },
      validate: {
        params: {
          communityBusinessId: meOrId,
          visitActivityId: id},
      },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { knex, params: { visitActivityId } } = request;
      return CommunityBusinesses.deleteVisitActivity(knex, Number(visitActivityId));
    },
  },
];
