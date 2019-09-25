import * as Boom from '@hapi/boom';
import * as moment from 'moment' ;
import { CommunityBusinesses } from '../../../models';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';
import {
  response,
  visitActivitiesPostPayload,
  visitActivitiesPutPayload,
  id,
  visitActivitiesGetQuery } from './schema';
import { Weekday } from '../../../models/types';
import { Api } from '../types/api'


const routes: [
  Api.CommunityBusinesses.Me.VisitActivities.GET.Route,
  Api.CommunityBusinesses.Me.VisitActivities.POST.Route,
  Api.CommunityBusinesses.Me.VisitActivities.PUT.Route,
  Api.CommunityBusinesses.Me.VisitActivities.DELETE.Route,
  Api.CommunityBusinesses.Id.VisitActivities.GET.Route,
] = [
  {
    method: 'GET',
    path: '/community-businesses/me/visit-activities',
    options: {
      description: 'Retrieve all visit activities for a community business',
      auth: {
        strategies: ['standard', 'external'],
        access: {
          scope: ['visit_activities-own:read', 'api:visitor:read'],
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
    handler: async (request, h) => {
      const {
        pre: { communityBusiness },
        query: { day: _day = null },
        server: { app: { knex } }
      } = request;

      const day = _day === 'today'
        ? moment().format('dddd').toLowerCase() as Weekday
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
    handler: async (request, h) => {
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
    handler: async (request, h) => {
      const {
        payload,
        pre: { communityBusiness },
        params: { visitActivityId },
        server: { app: { knex } }
      } = request;

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
    handler: async (request, h) => {
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
    handler: async (request, h) => {
      const {
        pre: { communityBusiness, isChild },
        query: { day: _day = null },
        server: { app: { knex } }
      } = request;

      if (!isChild) {
        return Boom.forbidden('Access to this resource is forbidden');
      }

      const day = _day === 'today'
        ? moment().format('dddd').toLowerCase() as Weekday
        : _day;

      return CommunityBusinesses.getVisitActivities(knex, communityBusiness, day);
    },
  },
];

export default routes;
