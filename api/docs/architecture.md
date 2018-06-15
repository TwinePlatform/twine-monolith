# Application Architecture
This is just a sketch

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
|  |- app.js
|  |- index.js
```
