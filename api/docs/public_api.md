# Public API

Some parts of the API are publicly exposed and accessible to registered users who have an API access token. See the [authentication](./authentication.md) section for more information on this.

The endpoints of the API that are made public are documented below.

## Contents
- [Common query parameters](#common-query-parameters)
- [Endpoints](#endpoints)
  - [GET /v1/community-businesses/me](#get-v1community-businessesme)
  - [GET /v1/community-businesses/me/visitors](#get-v1community-businessesmevisitors)
  - [GET /v1/community-businesses/me/visitors/:id](#get-v1community-businessesmevisitorsid)
  - [GET /v1/community-businesses/me/feedback](#get-v1community-businessesmefeedback)
  - [GET /v1/community-businesses/me/feedback/aggregates](#get-v1community-businessesmefeedbackaggregates)
  - [GET /v1/community-businesses/me/visit-activities](#get-v1community-businessesmevisit-activities)
  - [GET /v1/community-businesses/me/visit-logs](#get-v1community-businessesmevisit-logs)
  - [GET /v1/community-businesses/me/visit-logs/aggregates](#get-v1community-businessesmevisit-logsaggregates)


## Common query parameters
The API supports objects and arrays in query strings, encoded and parsed by the [qs](https://npmjs.com/package/qs) module (e.g. `?array[0]=foo&array[1]=bar` is parsed to `array=['foo', 'bar']`). See the qs module's documentation for more examples.
x
Where specified, the following query parameters all have the same meaning:

### `fields`
- Array of strings (field names)

Specify which fields of the response payload to return.

Example: `?fields[]=id&fields[]=name`

### `limit`
- Integer

Specify the maximum number of results to return

Example: `?limit=10`

### `offset`
- Integer

Specify the offset from the first record when returning results (used for pagination)

Example: `?offset=100`

### `sort`
- String (field name)

Specify which field of the response payload to sort results by

Example: `?sort=birthYear`

### `order`
- "asc" or "desc"

Specify the order of the sort

Example: `?sort=birthYear&order=asc`

## Endpoints
### GET /v1/community-businesses/me
Query parameters:
- [`fields`](#fields)

### GET /v1/community-businesses/me/visitors
Query parameters:
- [`fields`](#fields)
- [`limit`](#limit)
- [`offset`](#offset)
- [`sort`](#sort)
- [`order`](#order)
- `visits`: boolean -- Should include list of visits with each user record
- `filter`: -- inclusive filter on list of results
  - `age`: [integer, integer] -- age limits, min to max
  - `gender`: male | female | prefer not to say
  - `name`: string -- full name filter (no partial match or fuzzy search)
  - `email`: string
  - `postCode`: string
  - `phoneNumber`: string
  - `visitActivity`: string -- filter on visit activity name

### GET /v1/community-businesses/me/visitors/:id
Query parameters:
- `visits`: boolean -- Should include list of visits with each user record

### GET /v1/community-businesses/me/feedback
Query parameters:
- [`limit`](#limit)
- [`offset`](#offset)
- `since`: ISO-86001 date string
- `until`: ISO-86001 date string

### GET /v1/community-businesses/me/feedback/aggregates
Query parameters:
- `since`: ISO Date string
- `until`: ISO Date string

### GET /v1/community-businesses/me/visit-activities
Query parameters:
- [`fields`](#fields)
- [`limit`](#limit)
- [`offset`](#offset)
- [`sort`](#sort)
- [`order`](#order)
- `day`: "today" | lower-case weekday -- day for which to return activities

### GET /v1/community-businesses/me/visit-logs
Query parameters:
- [`fields`](#fields)
- [`limit`](#limit)
- [`offset`](#offset)
- [`sort`](#sort)
- [`order`](#order)
- `filter`: -- inclusive filter on list of results
  - `age`: [integer, integer] -- age limits, min to max
  - `visitActivity`: string -- filter on visit activity name
  - `gender`: male | female | prefer not to say

### GET /v1/community-businesses/me/visit-logs/aggregates
Query parameters:
- `fields`: Array of any of `gender`, `age`, `visitActivity`, or `lastWeek`
- [`limit`](#limit)
- [`offset`](#offset)
- [`sort`](#sort)
- [`order`](#order)
- `filter`: -- inclusive filter on list of results
  - `age`: [integer, integer] -- age limits, min to max
  - `visitActivity`: string -- filter on visit activity name
  - `gender`: male | female | prefer not to say
