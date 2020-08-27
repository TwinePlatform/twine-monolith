import * as Boom from '@hapi/boom';
import { Users } from '../../../models';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Api } from '../types/api';
import { Serialisers } from '../serialisers';
import { any } from '@hapi/joi';
import { userId } from '../schema/request';
import { RoleEnum } from '../../../models/types';
import { VolunteerLogs, CommunityBusinesses, Volunteers } from '../../../models';
import Knex = require('knex');
import { promises } from 'dns';
import community_businesses from '../regions/community_businesses';

// const fs = require('fs');
// const csv = require('csv-parser');
// const stripBom = require('strip-bom-stream');	
const neatCsv = require('neat-csv');


const routes: [
    Api.Upload.Volunteer.POST.Route,
    Api.Upload.Volunteer.POST.Route,
    Api.Upload.Volunteer.POST.Route,
    Api.Upload.Volunteer.POST.Route
]
    = [
        {
            method: 'POST',
            path: '/upload/CSVlogs/{organisationId}',
            options: {
                description: 'Upload activity from dashboard using CSV format',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read'],
                    },
                },
            },
            handler: async (request, h) => {

                const {
                    params: { organisationId },
                    server: { app: { knex, config } },
                } = request;

                const csvfile = request.payload;

                const csvArray = await neatCsv(csvfile['csv']);

                var errorArr: any = ['Error: incomplete table'];
                var rowNum = 1;
                csvArray.forEach((row: any) => {
                    rowNum++;
                    for (const [key, value] of Object.entries(row)) {
                        // - check if field is populated 
                        if (!value) {
                            const obj = { rowNum, key };
                            errorArr.push(obj);
                        }
                    }
                });

                if (errorArr != []) {
                    return errorArr;
                } else {
                    let i = 0;
                    let logArr: any = [];
                    for (i = 0; i <= csvArray.length - 1; i++) {
                        const email = csvArray[i]['Volunteer Email'];
                        const user_Id = await Users.getWithEmail(knex, email);

                        // add logs using 
                        try {
                            const log = await VolunteerLogs.add(knex, {
                                "userId": user_Id[0].user_account_id,
                                "organisationId": parseInt(organisationId),
                                "project": csvArray[i]['Project'],
                                "activity": csvArray[i]['Activity'],
                                "duration": {
                                    "hours": csvArray[i]['Duration (hours)'],
                                    "minutes": csvArray[i]['Duration (minutes)']
                                },
                                "startedAt": csvArray[i]['Date'],
                            });

                        } catch (error) {
                            if (error.code === '23502') { // Violation of null constraint implies invalid activity
                                return Boom.badRequest('Invalid activity or project');
                            }
                            throw error;
                        }
                    }

                    return logArr;
                }
            },
        },
        {
            method: 'POST',
            path: '/upload/activity',
            options: {
                description: 'Upload activity from dashboard using CSV format',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read'],
                    },
                },

            },
            handler: async (request, h) => {

                const {
                    server: { app: { knex, config } },
                } = request;

                console.log('in the activity endpoint');

                const csvfile = request.payload;
                const csvArray = await neatCsv(csvfile['csv']);
                console.log(csvArray);
                let i = 0;
                let activityArr = [];
                for (i = 0; i <= csvArray.length - 1; i++) {
                    const activity = csvArray[i]['Name'];
                    console.log(activity);
                    const activityInsert = await CommunityBusinesses.addVolunteerActivity(knex, activity);
                    activityArr.push(activityInsert);
                }

                return activityArr;
            },
        },
        {
            method: 'POST',
            path: '/upload/project/{organisationId}',
            options: {
                description: 'Upload activity from dashboard using CSV format',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read'],
                    },
                },
                // validate: {	
                //     query,	
                // },	
                // response: { schema: response },	
            },
            handler: async (request, h) => {

                const {
                    params: { organisationId },
                    server: { app: { knex, config } },
                } = request;

                console.log('in the project endpoint');

                const csvfile = request.payload;
                const csvArray = await neatCsv(csvfile['csv']);
                console.log(organisationId);
                console.log(csvArray);
                let i = 0;
                let projectArr = [];
                for (i = 0; i <= csvArray.length - 1; i++) {
                    const project = csvArray[i]['Name'];
                    console.log(project);
                    const projectInsert = await CommunityBusinesses.addVolunteerProject(knex, project, organisationId);
                    projectArr.push(projectInsert);
                }

                return projectArr;
            },
        },
        {
            method: 'POST',
            path: '/upload/volunteer/{organisationId}',
            options: {
                description: 'Upload activity from dashboard using CSV format',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read'],
                    },
                },
            },
            handler: async (request, h) => {
                const {
                    params: { organisationId },
                    server: { app: { knex, config } },
                } = request;

                console.log('in the volunteer registration endpoint');

                const csvfile = request.payload;
                const csvArray = await neatCsv(csvfile['csv']);
                const role = RoleEnum.VOLUNTEER;
                let i = 0;
                let data = {};
                for (i = 0; i <= csvArray.length - 1; i++) {
                    const email = csvArray[i]['Email Address'];
                    console.log()
                    const communityBusiness = await CommunityBusinesses
                        .getOne(knex, { where: { id: parseInt(organisationId), deletedAt: null } });

                    console.log(communityBusiness);

                    data = {
                        organisationId: organisationId,
                        role: role,
                        name: csvArray[i]['Volunteer Name'],
                        gender: 'prefer not to say',
                        email: email,
                        postCode: csvArray[i]['Postcode'],
                        password: csvArray[i]['Password'],
                        birthYear: csvArray[i]['Birth year'],
                    };

                    console.log(data);

                    if (await Users.exists(knex, { where: { email } })) {
                        return Boom.conflict('It appears this email is already registered.');
                    }

                    try {
                        const volunteer =
                            await Volunteers.addWithRole(knex, data, role, communityBusiness);

                        return Serialisers.volunteers.noSecrets(volunteer);

                    } catch (error) {
                        if (error.message === 'Invalid volunteer admin code') {
                            return Boom.unauthorized(error.message);
                        }
                        return error;
                    }
                }

                return null;
            },
        },
    ]



export default routes; 