# Api Migration

New API can be found in [json format here](./api.json)

## /sectors
/sectors
/sectors/:id

/sectors/:id/feedback
/sectors/:id/visits
/sectors/:id/activities

## /regions
/regions
/regions/:id

## /organisations
/organisations
/organisations/:id || me

### /organisations/:id/visit_activities
`GET` replaces `/api/activities/today || all` 👣 visitor app // filter used for individual day

`POST` replaces `/api/activity/add` 👣 visitor app 

`PUT` replaces `/api/activity/update` 👣 visitor app 

`DELETE` replaces `'/api/activity/delete'` 👣 visitor app 

/organisations/:id/feedback

### /organisations/:id/users
`GET` replaces `/api/users/all` 👣 visitor app 
`GET` replaces `/api/visitors/filtered` 👣 visitor app 
`GET` replaces `/api/visitors/all` 👣 visitor app 

### /organisations/:id/visits
`GET` replaces `/api/users/filtered`  👣 visitor app 

/organisations/:id/volunteer_logs
/organisations/:id/meetings
/organisations/:id/outreach

## /users (does this want to be broken down for frontline?)
/users
/users/register
/users/login
### /users/:id || me
`GET` replaces `/api/user/details` 👣 visitor app 
`GET` replaces `/api/user/name-from-scan` 👣 visitor app   🤔 not sure if this should be covered here with qr params or under a `/users/:id/qr_code` route.


/users/:id/password_reset


/users/:id/qr_code/email (separate resource?)
/users/:id/activities/:id (visit?)

/users/:id/volunteer_logs
/users/:id/volunteer_logs/:id
/users/:id/volunteer_logs/sync (potentially covered by POST)
/users/:id/meetings
/users/:id/meetings/sync (potentially covered by POST)
/users/:id/meetings/:id
