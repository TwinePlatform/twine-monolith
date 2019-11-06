# Architecture

This documents the desired architecture for this project.

### Root

```
./
|- bin          Developer and deployment scripts
|- docs         Documentation
|- assets       Public assets
|- src          native app
|  |- assets          Contains static assets like images, SVGs
|  |- components      Common components used throughout the app
|  |- styles          Stylesheets for external components or other things not compatible with Styled Components
|  |- <admin | volunteer>_views | shared_views
|  |  |- components   Feature-specific components
|  |  |- screens        Feature-specific routes/pages
|  |  |- index.ts     Defines public interface of <FEATURE> module
|  |- lib
|  |  |- api          Interface with the Twine HTTP API
|  |  |- utils        App specific helper functions
|  |- redux
|  |  |- <entity / feature / grouping>  Any coherent grouping or feature set (e.g. "logs")
|  |  |  |- index.ts    Either all actions/action-creators/reducers/selectors in this file, OR...
|  |  |  |- reducer.ts  ...separate out each of the above into their own file.
|  |  |  |- ...
|  |  |- rootReducer.ts
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

