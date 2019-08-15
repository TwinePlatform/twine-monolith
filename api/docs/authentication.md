# Authentication

There are three ways to authenticate with the API: a cookie-based method, and two token-based methods.

## Summary
### Cookie Authentication
This is a server-side session based method, using the `standard` authentication strategy, and is intended for all users interacting normally with client web-apps. Session IDs are stored in a cookie passed to the client, and session records are stored in a session cache on the backend.

### Token Authentication
This is also a server-side session based method, using the `standard` authentication strategy, and is intended for users of the _Volunteer native app_. This functions the same way as the cookie-based method, but the session ID is sent in the `Authorization` header instead of in a cookie (since cookies can be problematic on Cordova/Ionic-v1 apps).

### Bearer Token Authentication
This is a token-based method, using the `external` authentication strategy, and is intended for registered users of the platform who wish to access their own data programmatically. It is differentiated from the previous token-based method because it uses the "bearer token" format (i.e. `Authorization: Bearer <TOKEN>`).

## User Instructions

### Bearer Token Authentication
You must first get in contact in order to request an API token from Twine. Once you have received your token, you may use it as a bearer token in HTTP `GET` requests to endpoints that are publicly exposed, a [list of which can be found here](./public_api.md)

For example:
```
$ curl -H "Authorization: Bearer <TOKEN>" https://api.twine-together.com/v1/community-businesses/me/visitors
```
