import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as moment from 'moment' ;
import { CommunityBusinesses, CommunityBusiness } from '../../../models';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';
import {
  response,
  visitActivitiesPostPayload,
  visitActivitiesPutPayload,
  id,
  visitActivitiesGetQuery } from './schema';
import { VisitActivity } from '../../../models/types';
import { Day } from '../../../types/internal';

interface GetRequest extends Hapi.Request {
  query: {
    day: Day | 'today'
  };
}
interface PostRequest extends Hapi.Request {
  payload: Pick<VisitActivity, 'name' | 'category'>;
}
interface PutRequest extends Hapi.Request {
  payload: Partial<VisitActivity>;
}

export default [
  {
    method: 'GET',
    path: '/community-businesses/me/visit-activities',
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
      const { pre, query: { day: _day = null }, server: { app: { knex } } } = request;
      const communityBusiness = <CommunityBusiness> pre.communityBusiness;

      const day = _day === 'today'
        ? <Day> moment().format('dddd').toLowerCase()
        : _day;

      return CommunityBusinesses.getVisitActivities(knex, communityBusiness, day);
    },
  },
  {
    method: 'POST',
    path: '/community-businesses/me/visit-activities',
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
    handler: async (request: PostRequest, h: Hapi.ResponseToolkit) => {
      const {
        payload: visitActivity,
        pre: { communityBusiness },
        server: { app: { knex } },
      } = request;
      return CommunityBusinesses.addVisitActivity(knex, visitActivity, communityBusiness);
    },
  },
  {
    method: 'PUT',
    path: '/community-businesses/me/visit-activities/{visitActivityId}',
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
        payload: visitActivitiesPutPayload,
        params: {
          visitActivityId: id,
        },
      },
      response: { schema: response },
    },
    handler: async (request: PutRequest, h: Hapi.ResponseToolkit) => {
      const { payload, pre, params: { visitActivityId }, server: { app: { knex } } } = request;
      const communityBusiness = <CommunityBusiness> pre.communityBusiness;

      const visitActivity =
        await CommunityBusinesses.getVisitActivityById(knex, communityBusiness, +visitActivityId);

      if (!visitActivity) {
        return Boom.forbidden('Access to this visit activity is forbidden');
      }

      const updatedActivity = await CommunityBusinesses.updateVisitActivity(
        knex,
        { ...visitActivity, ...payload }
      );

      return updatedActivity
        ? updatedActivity
        : Boom.badImplementation('Update failed');
    },
  },
  {
    method: 'DELETE',
    path: '/community-businesses/me/visit-activities/{visitActivityId}',
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
          visitActivityId: id,
        },
      },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { params: { visitActivityId }, server: { app: { knex } } } = request;
      return CommunityBusinesses.deleteVisitActivity(knex, Number(visitActivityId));
    },
  },
  {
    method: 'GET',
    path: '/community-businesses/{organisationId}/visit-activities',
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
        params: { organisationId: id },
      },
      response: { schema: response },
    },
    handler: async (request: GetRequest, h: Hapi.ResponseToolkit) => {
      const { pre, query: { day: _day = null }, server: { app: { knex } } } = request;
      const communityBusiness = <CommunityBusiness> pre.communityBusiness;

      if (!pre.isChild) {
        return Boom.forbidden('Access to this resource is forbidden');
      }

      const day = _day === 'today'
          ? <Day> moment().format('dddd').toLowerCase()
          : _day;

      return CommunityBusinesses.getVisitActivities(knex, communityBusiness, day);
    },
  },
] as Hapi.ServerRoute[];
