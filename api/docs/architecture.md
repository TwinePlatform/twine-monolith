# Application Architecture

## General
* Authentication
  * Authenticate
  * Permissions
  * Roles
  * Resources
* Router
  * Validate request
  * Authenticate & authorise request
  * Determine which controller to call based on request
  * Forms the response of the controller into a well-formed API request
* Controllers
  * All application logic, delegate to appropriate Services and Models
* Models
  * Business logic relating to DB entities
* Services
  * E-mail
  * Frontline
* Scheduled Jobs

## Diagram
![[application architecture]](./assets/architecture.png)

## Directory Structure
```
/
|- bin
|- config
|- database
|- docs
|- src
|  |- api
|  |  |- v1
|  |  |  |- organisation
|  |  |  |  |- ...
|  |  |  |  |- index.js
|  |  |  |- user
|  |  |  |- outreach_campaign
|  |  |  |- ...
|  |  |  |- index.js
|  |- auth
|  |- models
|  |- services
|  |- tasks
|  |- server.js
|  |- index.js
```

### API
The `api` directory is partitioned by version (currently `v1` only), and each version is partitioned using top-level entities (community-businesses, users, etc.), and some standard directories.

#### Standard directories & files
```
|- v1
|  |- ...
|  |- hooks         (2)
|  |- prerequisites (3)
|  |- schema        (4)
|  |- types         (5)
|  |- utils         (6)
|  |- index.ts      (1)
```
1. `index.ts`: Exports Hapi plugin containing all necessary setup and routes for API.
2. `hooks`: Contains functions intended to be attached to the [Hapi request lifecycle](https://hapijs.com/api#request-lifecycle).
3. `prerequisites`: Contains functions intended to be used in route defintions as [pre-requisites](https://hapijs.com/api#route.options.pre).
4. `schema`: Contains `Joi` schema commonly used across the entire API, including schema used to validate standard API response.
5. `types`: Contains types commonly used across the entire API.
6. `utils`: Contains commonly used utility functions.

#### Entity directories
The `community_business` entity will be used as an example for how top-level entity directories should be structured
```
|- community_businesses
|  |- ...
|  |- visitors  (5)
|  |  |- ...
|  |- get.ts    (4)
|  |- ...
|  |- index.ts  (1)
|  |- schema.ts (3)
|  |- types.ts  (2)
```

1. `index.ts`: Entry point, defines the public interface; only those things exported by this file should be accessed from files outside of `/community_businesses`. Default export should be an array of `Hapi.ServerRoute` objects.
2. `types.ts`: Any and all types specific to the `/community-business` routes. Should export extensions of `Hapi.ServerRoute` for each defined route.
3. `schema.ts`: Any and all `Joi` schema specific to the `/community-business` routes.
4. `get.ts`:
   * Routes concerned with reading the top-level resource. Can, for example, contain `GET /community-businesses`, `GET /community-businesses/:id` and variations thereof
   * Other files named after the HTTP method (e.g. `put.ts`) can group together similar operations on the top-level resource
5. `visitors` and other sub-directories:
   * Operations on lower-level resource (e.g. `community-businesses/:id/visitors`) should be grouped in their own sub-directory, unless that sub-directory would contain only one file, in which case that file can simply go in `/community-businesses` instead.
