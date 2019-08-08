# Sessions

In order to facilitate usage monitoring, the API uses server-side sessions to manage authentication. This is done using [@hapi/yar](https://github.com/hapijs/yar) as the session manager and [@hapi/catbox-redis](https://github.com/hapijs/catbox-redi) to setup the redis-cache.

## Model
Unlike the previous session management system, all requests are now assigned session cookies. This is enforced by `yar`. This means client authentication is now done on the basis of the value of session data, specifically a `isAuthenticated` flag stored in the session store. A successful login request will result in this flag having a `true` value. Requests to protected endpoints will check the value of this flag before authenticating the request. A logout clears all session data.

## Schema
`Yar` is built around cookie-based authentication and does not support header based authentication. However, the native app requires us to support header based authentication. This can be supported through the use of lifecycle hooks, in particular the `onPreAuth` hook.

`Yar` uses the `onPreAuth` hook to initialise the `Yar` object using the decrypted value of the cookie (held in `request.state`). We can insert our own `onPreAuth` hook before the `Yar` hook which inspects the `Authorization` header and if it is set, moves that value into `request.state` in the format expected by `Yar`. This way, `yar`, and therefore the rest of the system, will treat both kinds of requests the same from `onPreAuth` onwards.

## Strategy
The strategy is only required to provide a `validate` function which has access to the session data (via the `request` object), and establishes whether the session ID corresponds to a valid user and organisation.

Configuration is managed by two parts of the config object: `config.auth.schema.session_cookie` and `config.cache.session`.

### `config.cache.session`
Configures the redis cache, using the [options allowed by `catbox-redis`](https://github.com/hapijs/catbox-redis#options)

### `config.auth.schema.session_cookie`
Configures the session manager Yar, as well as the cookie options, using the [options allow by `yar`](https://github.com/hapijs/yar/blob/master/API.md#options).

## Redis
Redis is used as the session cache
