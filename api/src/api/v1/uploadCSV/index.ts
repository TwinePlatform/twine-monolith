import * as Boom from '@hapi/boom';
import { Users } from '../../../models';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Api } from '../types/api';
import { Serialisers } from '../serialisers';

const fs = require('fs');
const csv = require('csv-parser');
// const stripBom = require('strip-bom-stream');


const routes: [
    Api.Upload.Volunteer.POST.Route,
    Api.Upload.Volunteer.POST.Route,
    Api.Upload.Volunteer.POST.Route,
    Api.Upload.Volunteer.POST.Route
]
    = [
        {
            method: 'POST',
            path: '/community-businesses/project',
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

                console.log('in the project endpoint');

                const csvfile = request.payload;
                console.log(csvfile);

                const file = fs.createReadStream(csvfile);
                const parseCsv = file.pipe(csv.parse());

                console.log(file);

                // Setup the parse stream to extract the account owner

                let accountOwner;

                parseCsv.on('data', (row: any) => {
                    console.log(row);
                    //   if (text == row[1]){
                    //     accountOwner = row[2];
                    //   }
                });

                // Wait for the stream to process, or throw on an error
                // await Toys.stream(parseCsv);

                //parse to DB 
                // const res = await client('column header[0]')
                // .insert({ '[R0][C0]': [Ri][C0], '[R0][C1]': [Ri][C1], '[R0][C2]': [Ri][C2] },...
                //{});

                return accountOwner;



                // return null;
            },
        },
        {
            method: 'POST',
            path: '/community-businesses/activity',
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

                console.log('in the activity endpoint');

                const csvfile = request.payload;
                console.log(csvfile);

                const file = fs.createReadStream(csvfile);
                const parseCsv = file.pipe(csv.parse());

                console.log(file);

                // Setup the parse stream to extract the account owner

                let accountOwner;

                parseCsv.on('data', (row: any) => {
                    console.log(row);
                    //   if (text == row[1]){
                    //     accountOwner = row[2];
                    //   }
                });

                // Wait for the stream to process, or throw on an error
                // await Toys.stream(parseCsv);

                //parse to DB 
                // const res = await client('column header[0]')
                // .insert({ '[R0][C0]': [Ri][C0], '[R0][C1]': [Ri][C1], '[R0][C2]': [Ri][C2] },...
                //{});

                return accountOwner;



                // return null;
            },
        },
        {
            method: 'POST',
            path: '/community-businesses/volunteer',
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

                const file = fs.createReadStream(csvfile);
                const parseCsv = file.pipe(csv.parse());

                console.log(file);

                // Setup the parse stream to extract the account owner

                let accountOwner;

                parseCsv.on('data', (row: any) => {
                    console.log(row);
                    //   if (text == row[1]){
                    //     accountOwner = row[2];
                    //   }
                });

                // Wait for the stream to process, or throw on an error
                // await Toys.stream(parseCsv);

                //parse to DB 
                // const res = await client('column header[0]')
                // .insert({ '[R0][C0]': [Ri][C0], '[R0][C1]': [Ri][C1], '[R0][C2]': [Ri][C2] },...
                //{});

                return accountOwner;



                // return null;
            },
        },
        {
            method: 'POST',
            path: '/community-businesses/time',
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

                const file = fs.createReadStream(csvfile);
                const parseCsv = file.pipe(csv.parse());

                console.log(file);

                // Setup the parse stream to extract the account owner

                let accountOwner;

                parseCsv.on('data', (row: any) => {
                    console.log(row);
                    //   if (text == row[1]){
                    //     accountOwner = row[2];
                    //   }
                });

                // Wait for the stream to process, or throw on an error
                // await Toys.stream(parseCsv);

                //parse to DB 
                // const res = await client('column header[0]')
                // .insert({ '[R0][C0]': [Ri][C0], '[R0][C1]': [Ri][C1], '[R0][C2]': [Ri][C2] },...
                //{});

                return accountOwner;



                // return null;
            },
        },
    ]



export default routes;