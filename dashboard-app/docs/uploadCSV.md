# Admin Dashboard Documentation	

## Contents	
1. Uploading CSV through the dashboard 	

## Uploading CSV through the dashboard 	
### Mega file will :	
- register volunteer	
- add project	
- add activities 	
- add logs 	

### Before submitting:	
- make sure the first table has columns, (*even when no volunteers are to be registered):	
    - Volunteer Name	
    - Email Address		
    - Postcode		
    - Birth year	
    - Password	
    - Role (has to be volunteer)	
- make sure second table has columns: 	
    - Volunteer Email	
    - Project	Activity	
    - Date (format: MM/DD/YYYYThh:mm:ssZ)	
    - Duration (hours)	
    - Duration (minutes)	
- first and second table are seperated by reserved character '$$$'	
- make sure all columns are filled 	

### API result Return:	
- when a column in either table is not filled 	
    -nothing will be added to the Database	
```json
{	
    "result": [	
        "Error: incomplete table",	
        {	
            "rowNum": 2,	
            "key": "Project"	
        },	
        {	
            "rowNum": 3,	
            "key": "Activity"	
        }	
    ]	
}	
```
- when volunteer is registered 	
    - the only role that can be registered through the dashboard is volunteer 	
    - volunteer should/can change the details (e.g password and gender) after account registration 	
    - default values not included in table: 	
        - gender here is "prefer not to say"	
        - "phoneNumber": null,	
        - "isEmailConfirmed": false,	
        - "isPhoneNumberConfirmed": false,	
        - "isEmailConsentGranted": false,	
        - "isSMSConsentGranted": false,	
        - "createdAt": "2020-09-12T08:25:12.805Z",	
        - "modifiedAt": null,	
        - "deletedAt": null,	
        - "gender": "prefer not to say",	
        - "ethnicity": "prefer not to say",	
        - "disability": "prefer not to say",	
        - "isTemp": false	
```json
{	
    "error": {	
        "statusCode": 409,	
        "type": "Conflict",	
        "message": "It appears this1998@blackmesaresearch.comis already registered."	
    }	
}	
```
- volunteer registered 	
```json
{	
    "result": [	
        {	
            "id": 36,	
            "name": "Eddie Example",	
            "email": "a@blackmesaresearch.com",	
            "birthYear": 2000,	
            "postCode": "EX1 1EX",	
            "phoneNumber": null,	
            "isEmailConfirmed": false,	
            "isPhoneNumberConfirmed": false,	
            "isEmailConsentGranted": false,	
            "isSMSConsentGranted": false,	
            "createdAt": "2020-09-12T08:15:23.660Z",	
            "modifiedAt": null,	
            "deletedAt": null,	
            "gender": "prefer not to say",	
            "ethnicity": "prefer not to say",	
            "disability": "prefer not to say",	
            "isTemp": false	
        },	
        {	
            "id": 37,	
            "name": "Eddie Example1",	
            "email": "g@example.com",	
            "birthYear": 2000,	
            "postCode": "EX1 1EP",	
            "phoneNumber": null,	
            "isEmailConfirmed": false,	
            "isPhoneNumberConfirmed": false,	
            "isEmailConsentGranted": false,	
            "isSMSConsentGranted": false,	
            "createdAt": "2020-09-12T08:15:24.122Z",	
            "modifiedAt": null,	
            "deletedAt": null,	
            "gender": "prefer not to say",	
            "ethnicity": "prefer not to say",	
            "disability": "prefer not to say",	
            "isTemp": false	
        }	
    ]	
}	
```
- activity added 	
```json
{	
    "result": [	
        [	
            {	
                "Activity inserted": "Other4"	
            }	
        ],	
    ]	
}	
```
- project added 
```json
{	
    "result": [	
        [	
            {	
                "Project inserted": "Outdoor5"	
            }	
        ],	
    ]	
}	
```
- log exist 	
    - would return a error 500 as network error 	

- log logged 	
```json
{	
    "result": [	
        {	
            "id": 435,	
            "userId": 8,	
            "createdBy": null,	
            "organisationId": 1,	
            "duration": {	
                "hours": 3,	
                "minutes": 21	
            },	
            "startedAt": "2020-08-24T16:30:00.000Z",	
            "createdAt": "2020-09-12T08:25:13.738Z",	
            "modifiedAt": null,	
            "deletedAt": null,	
            "activity": "Other3",	
            "project": "Party"	
        },	
        {	
            "id": 436,	
            "userId": 8,	
            "createdBy": null,	
            "organisationId": 1,	
            "duration": {	
                "hours": 1,	
                "minutes": 23	
            },	
            "startedAt": "2020-08-25T16:30:00.000Z",	
            "createdAt": "2020-09-12T08:25:13.797Z",	
            "modifiedAt": null,	
            "deletedAt": null,	
            "activity": "Outdoor4",	
            "project": "Project test 1"	
        }	
    ]	
}	
```
- both volunteer being registered and log logged
```json
{	
    "result": [	
        {	
            "id": 38,	
            "name": "Eddie Example",	
            "email": "b@blackmesaresearch.com",	
            "birthYear": 2000,	
            "postCode": "EX1 1EX",	
            "phoneNumber": null,	
            "isEmailConfirmed": false,	
            "isPhoneNumberConfirmed": false,	
            "isEmailConsentGranted": false,	
            "isSMSConsentGranted": false,	
            "createdAt": "2020-09-12T08:25:12.805Z",	
            "modifiedAt": null,	
            "deletedAt": null,	
            "gender": "prefer not to say",	
            "ethnicity": "prefer not to say",	
            "disability": "prefer not to say",	
            "isTemp": false	
        },	
        {	
            "id": 39,	
            "name": "Eddie Example1",	
            "email": "h@example.com",	
            "birthYear": 2000,	
            "postCode": "EX1 1EP",	
            "phoneNumber": null,	
            "isEmailConfirmed": false,	
            "isPhoneNumberConfirmed": false,	
            "isEmailConsentGranted": false,	
            "isSMSConsentGranted": false,	
            "createdAt": "2020-09-12T08:25:13.265Z",	
            "modifiedAt": null,	
            "deletedAt": null,	
            "gender": "prefer not to say",	
            "ethnicity": "prefer not to say",	
            "disability": "prefer not to say",	
            "isTemp": false	
        },	
        {	
            "id": 435,	
            "userId": 8,	
            "createdBy": null,	
            "organisationId": 1,	
            "duration": {	
                "hours": 3,	
                "minutes": 21	
            },	
            "startedAt": "2020-08-24T16:30:00.000Z",	
            "createdAt": "2020-09-12T08:25:13.738Z",	
            "modifiedAt": null,	
            "deletedAt": null,	
            "activity": "Other3",	
            "project": "Party"	
        },	
        {	
            "id": 436,	
            "userId": 8,	
            "createdBy": null,	
            "organisationId": 1,	
            "duration": {	
                "hours": 1,	
                "minutes": 23	
            },	
            "startedAt": "2020-08-25T16:30:00.000Z",	
            "createdAt": "2020-09-12T08:25:13.797Z",	
            "modifiedAt": null,	
            "deletedAt": null,	
            "activity": "Outdoor4",	
            "project": "Project test 1"	
        }	
    ]	
}
```
