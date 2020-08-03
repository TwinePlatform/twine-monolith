import * as Boom from '@hapi/boom';
import { badges } from '../../../models';
import { query, response } from './schema';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Api } from '../types/api';
import { Serialisers } from '../serialisers';
import { userCredentials } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import * as Knex from 'knex';
import { element } from 'twine-util/random';
import { any } from 'ramda';

// const badgeCode = {
//     "tenthhour": 1,
//     "twentiethhour": 2,
//     "fiftiethhour": 3,
//     "invitation": 4,
//     "thirdmonth": 5,
//     "sixthmonth": 6,
//     "anniversary": 7,
//     "firstlog": 8,
//     "fifthlog": 9
// }

const routes: [Api.CommunityBusinesses.Me.Badges.GET.Route,
    Api.CommunityBusinesses.Me.Badges.GET.Route,
    Api.CommunityBusinesses.Me.Badges.POST.Route,
    Api.CommunityBusinesses.Me.Badges.POST.Route,
    Api.CommunityBusinesses.Me.Badges.POST.Route]
    = [
        {
            method: 'GET',
            path: '/community-businesses/me/getOwnBadges',
            options: {
                description: 'get volunteer own badges',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read'],
                    },
                },
                response: { schema: response },
                pre: [
                    { method: getCommunityBusiness, assign: 'communityBusiness' },
                ],
            },
            handler: async (request, h) => {
                const { user } = StandardCredentials.fromRequest(request);
                const {
                    server: { app: { knex } },
                    pre: { communityBusiness },
                } = request;
                const token = request.yar.id;
                const credentials = await userCredentials.get(knex, token);
                const userId = credentials[0].user_account_id;
                const orgId = credentials[0].organisation_id;

                const badgesArray = await badges.getAwards(knex, orgId, userId);


                return badgesArray;
            }
        },
        {
            method: 'GET',
            path: '/community-businesses/me/getCommunityBadges',
            options: {
                description: 'get badges from volunteer of community/organisation',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read'],
                    },
                },
                response: { schema: response },
                pre: [
                    { method: getCommunityBusiness, assign: 'communityBusiness' },
                ],
            },
            handler: async (request, h) => {
                const { user } = StandardCredentials.fromRequest(request);
                const {
                    server: { app: { knex } },
                    pre: { communityBusiness },
                } = request;
                const token = request.yar.id;
                const credentials = await userCredentials.get(knex, token);
                const userId = credentials[0].user_account_id;
                const orgId = credentials[0].organisation_id;

                //get badge of all users from organisation 
                const badgesArray = await badges.getAwards(knex, orgId);
                console.log(badgesArray);

                //merge objs with same keys 
                var consolidateAward: any = [];
                badgesArray.forEach(function (item: any) {
                    var existing = consolidateAward.filter(function (v: any, i: any) {
                        return v.user_account_id == item.user_account_id;
                    });
                    if (existing.length) {
                        var existingIndex = consolidateAward.indexOf(existing[0]);
                        consolidateAward[existingIndex].award_id = consolidateAward[existingIndex].award_id.concat(item.award_id);
                    } else {
                        if (typeof item.award_id == 'number') {
                            item.award_id = [item.award_id];
                            //[ { award_id: 1, user_account_id: 6 } ]
                        }
                        consolidateAward.push(item);
                    }
                });

                console.log(consolidateAward);

                //get all the unique user_account_id in an array 
                function onlyUnique(value: any, index: any, self: any) {
                    return self.indexOf(value) === index;
                }
                const volunteerIdArr = badgesArray.map((obj: any) => obj.user_account_id).filter(onlyUnique);

                const volunteerNameArr = await badges.getVolunteersNames(knex, volunteerIdArr);
                console.log(volunteerNameArr);

                const combinedArry = consolidateAward.concat(volunteerNameArr);

                function groupBy(objectArray: any, property: any) {
                    return objectArray.reduce(function (acc: any, obj: any) {
                        let key = obj[property]
                        if (!acc[key]) {
                            acc[key] = []
                        }
                        acc[key].push(obj)
                        return acc
                    }, {})
                }

                let groupedObjArr = groupBy(combinedArry, 'user_account_id');

                let finalArr = [];

                for (const key in groupedObjArr) {
                    let newObj = {};
                    const reducer = (acc: any, cv: any) => {
                        acc.user_name = cv.user_name;
                        Object.assign(newObj, acc);
                    };

                    groupedObjArr[key].reduce(reducer);

                    finalArr.push(newObj);
                }
                return finalArr;
            }
        },
        {
            method: 'POST',
            path: '/community-businesses/me/checkBadge',
            options: {
                description: 'Check if any new badges are awarded and update if necessary',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read'],
                    },
                },
                response: { schema: response },
                pre: [
                    { method: getCommunityBusiness, assign: 'communityBusiness' },
                ],
            },
            handler: async (request, h) => {
                const { user } = StandardCredentials.fromRequest(request);
                const {
                    server: { app: { knex } },
                    pre: { communityBusiness },
                } = request;

                const token = request.yar.id;
                console.log(token);
                //get UserId
                const credentials = await userCredentials.get(knex, token);
                const userId = credentials[0].user_account_id;
                const orgId = credentials[0].organisation_id;

                //check if badge exist in table using userId and OrganisationId
                const badgesArray = await badges.getAwards(knex, userId, orgId);

                var awardIdArrayList: any = [];

                badgesArray.forEach((awardID: any) => {
                    console.log(awardID);
                    awardIdArrayList.push(awardID.award_id);
                })

                // check condition for logged hours 
                // 1 = 10hours; 2 = 20 hours; 3 = 50hours
                const hoursLoggedObjArr = await badges.checkLoggedHours(knex, userId, orgId);
                const hoursLogged = hoursLoggedObjArr[0].total_duration.hours;
                var updateArray = [];
                if (!awardIdArrayList.includes(1)) {
                    if (hoursLogged >= 10) {
                        console.log('got more than 10 hours');
                        badges.updateAwards(knex, userId, orgId, 1);
                        updateArray.push('TenthHourBadge');
                    }
                }

                if (awardIdArrayList.includes(1) && !awardIdArrayList.includes(1)) {
                    if (hoursLogged >= 20) {
                        console.log('got more than 20 hours');
                        badges.updateAwards(knex, userId, orgId, 2);
                        updateArray.push('twentiethHourBadge');
                    }
                }

                if (awardIdArrayList.includes(1) && awardIdArrayList.includes(2) && !awardIdArrayList.includes(3)) {
                    if (hoursLogged >= 50) {
                        console.log('got more than 50 hours');
                        badges.updateAwards(knex, userId, orgId, 3);
                        updateArray.push('fiftiethHourBadge');
                    }
                }

                //  For number of log 
                // 100 = 1st log, subsequent logs are increment of 1 every 5 logs 101 = 5, 102 = 10,... 
                const numLoggedObjArr = await badges.checkNumLog(knex, userId, orgId);
                const numLogged = numLoggedObjArr[0].num_logs;

                if (!awardIdArrayList.includes(100)) {
                    if (numLogged >= 1) {
                        badges.updateAwards(knex, userId, orgId, 100);
                        updateArray.push('FirstLogBadge');
                    }
                }

                if (awardIdArrayList.includes(100)) {
                    // take largest award_id-100 >= numLog/5 round down 
                    // if false then insert 100 + numLog/5
                    const numofFifthLog = Math.floor(numLogged / 5);
                    const maxIdNormalized = (Math.max(...awardIdArrayList) - 100) / 5;
                    if (maxIdNormalized <= numofFifthLog) {
                        const newAward = 100 + numofFifthLog;
                        badges.updateAwards(knex, userId, orgId, newAward);
                        updateArray.push('FifthLogBadge');
                    }
                }

                //if new badge acheive => return trigger, else null 

                return updateArray;
            },
            //   {
            //       GET badges for self and get badges for others 
            //   }
        },
        {
            method: 'POST',
            path: '/community-businesses/me/getInviteBadge',
            options: {
                description: 'get the invite badge',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read'],
                    },
                },
                response: { schema: response },
                pre: [
                    { method: getCommunityBusiness, assign: 'communityBusiness' },
                ],
            },
            handler: async (request, h) => {
                const { user } = StandardCredentials.fromRequest(request);
                const {
                    server: { app: { knex } },
                    pre: { communityBusiness },
                } = request;
                const token = request.yar.id;
                const credentials = await userCredentials.get(knex, token);
                const userId = credentials[0].user_account_id;
                const orgId = credentials[0].organisation_id;
                //update DB with badgeId 4 which is the invitation badge
                badges.updateAwards(knex, userId, orgId, 4);
            }
        },
        {
            method: 'POST',
            path: '/community-businesses/me/getLoyaltyBadge',
            options: {
                description: 'get the invite badge',
                auth: {
                    strategy: 'standard',
                    access: {
                        scope: ['user_details-own:read'],
                    },
                },
                response: { schema: response },
                pre: [
                    { method: getCommunityBusiness, assign: 'communityBusiness' },
                ],
            },
            handler: async (request, h) => {
                const { user } = StandardCredentials.fromRequest(request);
                const {
                    server: { app: { knex } },
                    pre: { communityBusiness },
                } = request;
                const token = request.yar.id;
                const credentials = await userCredentials.get(knex, token);
                const userId = credentials[0].user_account_id;
                const orgId = credentials[0].organisation_id;

                //update DB with badgeId 4 which is the invitation badge
                const badgesArray = await badges.getAwards(knex, orgId, userId);

                var awardIdArrayList: any = [];

                badgesArray.forEach((awardID: any) => {
                    console.log(awardID);
                    awardIdArrayList.push(awardID.award_id);
                })
                // updateArray.push(badgeCode.fifthlog);
                //ToDo: if badge == 5,6,7 exist then trigger flag 

            }
        }
    ]



export default routes;