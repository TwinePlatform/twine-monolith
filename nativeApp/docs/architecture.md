# Architecture

This documents the desired architecture for this project.

### Root

```
./
|- bin          Developer and deployment scripts
|- docs         Documentation
|- assets       Public assets
|- src          native app
|  |- authentication  Auth related code
|  |- api          Interface with the Twine HTTP API
|  |- lib
|  |  |- ui           Styles & common components used throughout the app
|  |  |- utils        Generalised helper functions
|  |- redux
|  |  |- <entity / feature / grouping>  Any coherent grouping or feature set (e.g. "logs")
|  |  |  |- index.ts    Either all actions/action-creators/reducers/selectors in this file, OR...
|  |  |  |- reducer.ts  ...separate out each of the above into their own file.
|  |  |  |- ...
|  |  |- rootReducer.ts
|  |- screens        Feature-specific routes/pages
|  |  |- [AUTH SPECIFIC]_views
|  |  |  |- components   Feature-specific components
|  |  |  |- index.ts     Defines public interface of <FEATURE> module
|  |- App.tsx
|  |- index.tsx
|- ...dot/json files
|- package.json
|- README.md
```

### Tests

Adhere to the `jest` convention of having a `__tests__` directory colocated with all files under-test. For example:

```
./foo
|- __tests__
|  |- magic.test.ts
|  |- index.test.ts
|- magic.tsx
|- index.tsx
```

