import * as Boom from '@hapi/boom';
import { Users } from '../../../models';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Api } from '../types/api';
import { Serialisers } from '../serialisers';
import { any } from '@hapi/joi';
import { userId } from '../schema/request';
import { VolunteerLogs, Volunteers, VolunteerLog, VolunteerLogPermissions } from '../../../models';
import Knex = require('knex');
import { promises } from 'dns';

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
            path: '/upload/CSVlogs',
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
                                "organisationId": 2,
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
                // validate: {	
                //     query,	
                // },	
                // response: { schema: response },	
            },
            handler: async (request, h) => {
                // const { user } = StandardCredentials.fromRequest(request);	
                const {
                    server: { app: { knex, config } },
                } = request;

                console.log('in the activity endpoint');

                const csvfile = request.payload;
                console.log(csvfile);


                return null;
            },
        },
        {
            method: 'POST',
            path: '/upload/volunteer',
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
                // const { user } = StandardCredentials.fromRequest(request);	
                // const {	
                //     payload,	
                //     server: { app: { EmailService, knex, config } },	
                //     pre: { communityBusiness },	
                // } = request;	

                console.log('in the volunteer endpoint');

                const csvfile = request.payload;
                console.log(csvfile);

                // const file = fs.createReadStream(csvfile);
                // const parseCsv = file.pipe(csv.parse());

                // console.log(file);

                // // Setup the parse stream to extract the account owner	

                // let accountOwner;

                // parseCsv.on('data', (row: any) => {
                //     console.log(row);
                //     //   if (text == row[1]){	
                //     //     accountOwner = row[2];	
                //     //   }	
                // });

                // Wait for the stream to process, or throw on an error	
                // await Toys.stream(parseCsv);	

                //parse to DB 	
                // const res = await client('column header[0]')	
                // .insert({ '[R0][C0]': [Ri][C0], '[R0][C1]': [Ri][C1], '[R0][C2]': [Ri][C2] },...	
                //{});	

                // return accountOwner;



                return null;
            },
        },
        {
            method: 'POST',
            path: '/upload/time',
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
                // const { user } = StandardCredentials.fromRequest(request);	
                // const {	
                //     payload,	
                //     server: { app: { EmailService, knex, config } },	
                //     pre: { communityBusiness },	
                // } = request;	

                console.log('in the time endpoint');

                const csvfile = request.payload;
                console.log(csvfile);

                // const file = fs.createReadStream(csvfile);
                // const parseCsv = file.pipe(csv.parse());

                // console.log(file);

                // // Setup the parse stream to extract the account owner	

                // let accountOwner;

                // parseCsv.on('data', (row: any) => {
                //     console.log(row);
                //     //   if (text == row[1]){	
                //     //     accountOwner = row[2];	
                //     //   }	
                // });

                // Wait for the stream to process, or throw on an error	
                // await Toys.stream(parseCsv);	

                //parse to DB 	
                // const res = await client('column header[0]')	
                // .insert({ '[R0][C0]': [Ri][C0], '[R0][C1]': [Ri][C1], '[R0][C2]': [Ri][C2] },...	
                //{});	

                // return accountOwner;



                return null;
            },
        },
    ]



export default routes; 