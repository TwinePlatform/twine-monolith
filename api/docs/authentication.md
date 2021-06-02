# Authentication & Authorization
The Role Based Access Control (RBAC) is implemented. With RBAC, the authentication and the authorization is seperated. Authenticated clients are allowed to access the server but the access is restricted to the role it is has. An illustration can be seen in the diagram below: 

![[RBAC Diagram]](./assets/RBAC_diagram.png)

## Authentication
Hapi authentication is based on the concept of schemes and strategies. Where strategy is a pre-configured instance of a scheme. The authentication is activated when the route uses the `auth` method in the option object. The `auth` method then uses the registered plugins. Route that do not require authentication are the login, logout and registration route. 

In the login route, the user name ane password will be validated. When successful a ![session](./sessions.md) will be initated using Hapi plugin - ![Yar Session Manager](https://hapi.dev/module/yar/), the data will be stored in the database and at the same time cached using the ![catbox-redis](https://hapi.dev/module/catbox-redis/) plugin. It is designed that no space is allocated to the !(catbox)[https://hapi.dev/module/catbox/api/?v=11.1.1] so that the redis will be used. The route will then return userId and a token to the client for validation purposes on routes that require authentication.

![Docs on authentification](https://hapi.dev/tutorials/auth/?lang=en_US)

## Authorization
 Users and organisations are given permission/privileges via static defined roles and only when the request has the sufficient scope will be grant access to the api e.g. CBadmin role will be allow to access all volunteers data from the same community business but volunteers are only allow to see their own data. This is validated in the route through the method `access` inside the `auth` object of the route. The role is manage by the role and permission model in the model folder. ![Permissions](./permissions.md) are essentially string that the route use to validate. 

More information on permission can be seen in [premission](./permission.md).

## Summary of Strategies
There are three strategies to authenticate with the API: a cookie-based method, and two token-based methods.

### Cookie Authentication (Web-apps)
This is a server-side session based method, using the `standard` authentication strategy, and is intended for all users interacting normally with client web-apps. Session IDs are stored in a cookie passed to the client, and session records are stored in a session cache on the backend.

### Token Authentication (Native App)
This is also a server-side session based method, using the `standard` authentication strategy, and is intended for users of the _Volunteer native app_. This functions the same way as the cookie-based method, but the session ID is sent in the `Authorization` header instead of in a cookie (since cookies can be problematic on Cordova/Ionic-v1 apps). 

### Bearer Token Authentication (Public API)
This is a token-based method, using the `external` authentication strategy, and is intended for registered users of the platform who wish to access their own data programmatically. It is differentiated from the previous token-based method because it uses the "bearer token" format (i.e. `Authorization: Bearer <TOKEN>`).

## Applied Strategies

### Standard Strategy
This is activated when the api endpoint has the auth strategy set to standard strategy: 
- the Hapi Request object is use to get the respective session through he hapi yar session manager 
- from the session the userId and organisationId is retrieved 
- `Credential` object is then created with user, organisation, ![roles](/authentication.md) and session information
    - can be imported from the api/auth/strategies/standard
    - the variable can be retrieved from `getCredentialsFromRequest` from api/auth

### External Strategy/Bearer Token Authentication
You must first get in contact in order to request an API token from Twine. Once you have received your token, you may use it as a bearer token in HTTP `GET` requests to endpoints that are publicly exposed, a [list of which can be found here](./public_api.md)

For example:
```
$ curl -H "Authorization: Bearer <TOKEN>" https://api.twine-together.com/v1/community-businesses/me/visitors
```
