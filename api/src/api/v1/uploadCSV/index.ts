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
]
    = [
        {
            method: 'POST',
            path: '/upload/CSVlogs/{organisationId}',
            options: {
                description: 'Upload activity from volunteer dashboard using CSV format',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read', 'organisations_volunteers-parent:write'],
                    },
                },
                payload: {
                    allow: 'multipart/form-data',
                    maxBytes: 1024 * 1024 * 100,
                    timeout: false,
                    multipart: {
                        output: "data"
                    },
                },
            },
            handler: async (request, h) => {

                const {
                    params: { organisationId },
                    server: { app: { knex, config } },
                } = request;

                const csvfile = request.payload;

                

                const splited = csvfile.csv.split('$$$');


                //first table in the csv file 
                const arr1 = await neatCsv(splited[0]);

                let ResultArr: any = [];
                var errorArr: any = ["Error: incomplete table"];
                var rowNum = 1;
                //if the first table is filled 
                if (arr1.length >= 1) {
                    //loop through the first table and check if everything is properly populated
                    arr1.forEach((row: any) => {
                        rowNum++;
                        for (const [key, value] of Object.entries(row)) {
                            // - check if field is populated 
                            if (!value && key != 'Phone number' && key != 'gender') {
                                const obj = { rowNum, key };
                                errorArr.push(obj);
                            }
                        }
                    });
                }


                //second table in the csv file 
                const csvArray = await neatCsv(csvfile['csv'], { skipLines: arr1.length + 2 });
                //loop through the second table and check if everything is properly populated
                csvArray.forEach((row: any) => {
                    rowNum++;
                    for (const [key, value] of Object.entries(row)) {
                        // - check if field is populated 
                        if (!value && key != 'empty column') {
                            const obj = { rowNum, key };
                            errorArr.push(obj);
                        }
                    }
                });


                // variables needed to register volunteers 
                const communityBusiness = await CommunityBusinesses
                    .getOne(knex, { where: { id: parseInt(organisationId), deletedAt: null } });
                const role = RoleEnum.VOLUNTEER;

                //if the first table is filled 
                if (arr1.length >= 1) {
                    if (errorArr.length > 1) {
                        return errorArr;
                        //else log and return the logged array
                    } else {
                        let i = 0;

                        //check if user is already registred
                        for (i = 0; i <= arr1.length - 1; i++) {
                            const email = arr1[i]['Email Address'];

                            if (await Users.exists(knex, { where: { email } })) {
                                return Boom.conflict('It appears this ' + email + ' is already registered.');
                            }
                        }

                        //registers volunteers 
                        for (i = 0; i <= arr1.length - 1; i++) {
                            const email = arr1[i]['Email Address'];

                            let data = {};
                            data = {
                                organisationId: organisationId,
                                role: role,
                                name: arr1[i]['Volunteer Name'],
                                gender: arr1[i]['Gender'] ?? 'prefer not to say',
                                email: email,
                                postCode: arr1[i]['Postcode'],
                                password: arr1[i]['Password'],
                                birthYear: arr1[i]['Birth year'],
                                phoneNumber: arr1[i]['Phone number'] ?? 'N/A',
                            };

                            try {
                                const volunteer = await Volunteers.addWithRole(knex, data, role, communityBusiness);
                                ResultArr.push(Serialisers.volunteers.noSecrets(volunteer));
                                // return Serialisers.volunteers.noSecrets(volunteer);

                            } catch (error) {

                                if (error.message === 'Invalid volunteer admin code') {
                                    return Boom.unauthorized(error.message);
                                }

                                return error;
                            }
                        }
                    }
                }

                //if table is incomplete return row and column that's incomplete
                if (errorArr.length > 1) {
                    return errorArr;
                    //else log and return the logged array
                } else {
                    let i = 0;
                    for (i = 0; i <= csvArray.length - 1; i++) {
                        const email = csvArray[i]['Volunteer Email'];
                        const user_Id = await Users.getWithEmail(knex, email);

                        if (user_Id.length < 1) {
                            return 'check if user has registered in the organisation';
                        }

                        //check if project and activity exist, if no add them 
                        const activityExists = await CommunityBusinesses.activityExists(knex, csvArray[i]['Activity']);
                        const projectExists = await CommunityBusinesses.projectExists(knex, csvArray[i]['Project'], organisationId);

                        if (!activityExists) {
                            const activityInsert = await CommunityBusinesses.addVolunteerActivity(knex, csvArray[i]['Activity']);
                            ResultArr.push([{ "Activity inserted": csvArray[i]['Activity'] }]);
                        }

                        if (!projectExists) {
                            const projectInsert = await CommunityBusinesses.addVolunteerProject(knex, csvArray[i]['Project'], organisationId);
                            ResultArr.push(ResultArr.push([{ "Project inserted": csvArray[i]['Project'] }]));
                        }

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

                            ResultArr.push(log);


                        } catch (error) {
                            if (error.code === '23502') { // Violation of null constraint implies invalid activity
                                return Boom.badRequest('Invalid activity or project');
                            }
                            throw error;
                        }
                    }

                    return ResultArr;
                }
            }
        },
        {
            method: 'POST',
            path: '/upload/CSVvisits/{organisationId}',
            options: {
                description: 'Upload activity from visitor dashboard using CSV format',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read', 'organisations_volunteers-parent:write'],
                    },
                },
                payload: {
                    allow: 'multipart/form-data',
                    maxBytes: 1024 * 1024 * 100,
                    timeout: false,
                    multipart: {
                        output: "data"
                    },
                },
            },
            handler: async (request, h) => {

                const {
                    params: { organisationId },
                    server: { app: { knex, config } },
                } = request;

                const csvfile = request.payload;



                //first table in the csv file 
                const arr1 = await neatCsv(csvfile);

                let ResultArr: any = [];
                var errorArr: any = ["Error: incomplete table"];
                var rowNum = 1;
                //if the first table is filled 
                if (arr1.length >= 1) {
                    //loop through the first table and check if everything is properly populated
                    arr1.forEach((row: any) => {
                        rowNum++;
                        for (const [key, value] of Object.entries(row)) {
                            // - check if field is populated 
                            if (!value && key != 'Phone number' && key != 'gender') {
                                const obj = { rowNum, key };
                                errorArr.push(obj);
                            }
                        }
                    });
                }


                //second table in the csv file 
                const csvArray = await neatCsv(csvfile['csv'], { skipLines: arr1.length + 2 });
                //loop through the second table and check if everything is properly populated
                csvArray.forEach((row: any) => {
                    rowNum++;
                    for (const [key, value] of Object.entries(row)) {
                        // - check if field is populated 
                        if (!value && key != 'empty column') {
                            const obj = { rowNum, key };
                            errorArr.push(obj);
                        }
                    }
                });


                // variables needed to register volunteers 
                const communityBusiness = await CommunityBusinesses
                    .getOne(knex, { where: { id: parseInt(organisationId), deletedAt: null } });
                const role = RoleEnum.VOLUNTEER;

                //if the first table is filled 
                if (arr1.length >= 1) {
                    if (errorArr.length > 1) {
                        return errorArr;
                        //else log and return the logged array
                    } else {
                        let i = 0;

                        //check if user is already registred
                        for (i = 0; i <= arr1.length - 1; i++) {
                            const email = arr1[i]['Email Address'];

                            if (await Users.exists(knex, { where: { email } })) {
                                return Boom.conflict('It appears this ' + email + ' is already registered.');
                            }
                        }

                        //registers volunteers 
                        for (i = 0; i <= arr1.length - 1; i++) {
                            const email = arr1[i]['Email Address'];

                            let data = {};
                            data = {
                                organisationId: organisationId,
                                role: role,
                                name: arr1[i]['Volunteer Name'],
                                gender: arr1[i]['Gender'] ?? 'prefer not to say',
                                email: email,
                                postCode: arr1[i]['Postcode'],
                                password: arr1[i]['Password'],
                                birthYear: arr1[i]['Birth year'],
                                phoneNumber: arr1[i]['Phone number'] ?? 'N/A',
                            };

                            try {
                                const volunteer = await Volunteers.addWithRole(knex, data, role, communityBusiness);
                                ResultArr.push(Serialisers.volunteers.noSecrets(volunteer));
                                // return Serialisers.volunteers.noSecrets(volunteer);

                            } catch (error) {

                                if (error.message === 'Invalid volunteer admin code') {
                                    return Boom.unauthorized(error.message);
                                }

                                return error;
                            }
                        }
                    }
                }

                //if table is incomplete return row and column that's incomplete
                if (errorArr.length > 1) {
                    return errorArr;
                    //else log and return the logged array
                } else {
                    let i = 0;
                    for (i = 0; i <= csvArray.length - 1; i++) {
                        const email = csvArray[i]['Volunteer Email'];
                        const user_Id = await Users.getWithEmail(knex, email);

                        if (user_Id.length < 1) {
                            return 'check if user has registered in the organisation';
                        }

                        //check if project and activity exist, if no add them 
                        const activityExists = await CommunityBusinesses.activityExists(knex, csvArray[i]['Activity']);
                        const projectExists = await CommunityBusinesses.projectExists(knex, csvArray[i]['Project'], organisationId);

                        if (!activityExists) {
                            const activityInsert = await CommunityBusinesses.addVolunteerActivity(knex, csvArray[i]['Activity']);
                            ResultArr.push([{ "Activity inserted": csvArray[i]['Activity'] }]);
                        }

                        if (!projectExists) {
                            const projectInsert = await CommunityBusinesses.addVolunteerProject(knex, csvArray[i]['Project'], organisationId);
                            ResultArr.push(ResultArr.push([{ "Project inserted": csvArray[i]['Project'] }]));
                        }

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

                            ResultArr.push(log);


                        } catch (error) {
                            if (error.code === '23502') { // Violation of null constraint implies invalid activity
                                return Boom.badRequest('Invalid activity or project');
                            }
                            throw error;
                        }
                    }

                    return ResultArr;
                }
            }
        }
    ]

export default routes; 