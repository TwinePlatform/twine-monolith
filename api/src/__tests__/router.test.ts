import {server} from '../server'
const apiJson = require('../../docs/api.json')

type httpMethod = 
  "GET"
  | "POST"
  | "PUT"
  | "DELETE"

type routeTestFixture = {
  testName: string,
  url: string,
  method: httpMethod,
  statusCode: number 
}

const routeTestFixtures: routeTestFixture [] = Object.keys(apiJson.routes)
  .reduce((acc, resource) => {
    const fullRoute = Object.entries(apiJson.routes[resource])
      .reduce((nestedAcc, [nestedRoute, methods]) => {
        const testObj = Object.entries(methods)
        .map(([method, routesProps]) => {
          const url = (resource + nestedRoute).replace(':id', '1')
          const statusCode = routesProps.isImplemented 
            ? 200
            : 404
          return {
            testName: `${method} test for route ${url}`,
            url,
            method,
            statusCode
          }
        })
        return [... nestedAcc, ...testObj]
      }, [])
    return [...acc, ...fullRoute]
}, [])

describe('route testing', () => {
  routeTestFixtures.forEach(fixture => {
    test(fixture.testName, async () => {
      const response = await server.inject({
        method: fixture.method,
        url: fixture.url,
      })
    expect(response.statusCode).toBe(fixture.statusCode);
    });
  })
})
