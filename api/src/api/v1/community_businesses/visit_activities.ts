import * as Hapi from 'hapi';
import * as moment from 'moment' ;
import { CommunityBusinesses } from '../../../models';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';
import {
  response,
  visitActivitiesPostPayload,
  visitActivitiesPutPayload,
  id,
  meOrId,
  visitActivitiesGetQuery } from './schema';
import { VisitActivity } from '../../../models/types';
import { Day } from '../../../types/internal';

interface GetRequest extends Hapi.Request {
  query: {
    day: Day | 'today'
  };
}

interface PostOrPutRequest extends Hapi.Request {
  payload: Partial<VisitActivity>;
}

export default [
  {
    method: 'GET',
    path: '/community-businesses/me/visit_activities',
    options: {
      description: 'Retrieve all visit activities for a community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['visit_activities-own:read'],
        },
      },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
      validate: {
        query: visitActivitiesGetQuery,
      },
      response: { schema: response },
    },
    handler: async (request: GetRequest, h: Hapi.ResponseToolkit) => {
      const { knex, pre: { communityBusiness }, query: { day: _day = null } } = request;
      const day = _day === 'today'
        ? <Day> moment().format('dddd').toLowerCase()
        : _day;

      return CommunityBusinesses.getVisitActivities(knex, communityBusiness, day);
    },
  },
  {
    method: 'POST',
    path: '/community-businesses/me/visit_activities',
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
        payload: visitActivitiesPostPayload,
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
    path: '/community-businesses/me/visit_activities/{visitActivityId}',
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
      validate: { payload: visitActivitiesPutPayload },
      response: { schema: response },
    },
    handler: async (request: PostOrPutRequest, h: Hapi.ResponseToolkit) => {
      const { knex, payload } = request;

      return CommunityBusinesses.updateVisitActivity(knex, payload);
    },
  },
  {
    method: 'DELETE',
    path: '/community-businesses/me/visit_activities/{visitActivityId}',
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
  {
    method: 'GET',
    path: '/community-businesses/{communityBusinessId}/visit_activities',
    options: {
      description: 'Retrieve all visit activities for a community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['visit_activities-child:read'],
        },
      },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildOrganisation, assign: 'isChild', failAction: 'error' },
      ],
      validate: {
        query: visitActivitiesGetQuery,
        params: { communityBusinessId: id },
      },
      response: { schema: response },
    },
    handler: async (request: GetRequest, h: Hapi.ResponseToolkit) => {
      const { knex, pre: { communityBusiness }, query: { day: _day = null } } = request;
      const day = _day === 'today'
        ? <Day> moment().format('dddd').toLowerCase()
        : _day;

      return CommunityBusinesses.getVisitActivities(knex, communityBusiness, day);
    },
  },
];
