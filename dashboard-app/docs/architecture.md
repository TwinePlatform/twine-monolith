# Architecture

This documents the desired architecture for this project.

### General

The general principle is to arrange the application in a kind of hub-and-spoke structure where each feature is a spoke, and the core application logic serves as the hub. There should ideally be no horizontal dependencies between features, each feature should only rely on the generic functionality provided by the hub. This should be reflected in the directory structure; if a feature directory is deleted, all other features should keep working.

### Root

```
./
|- bin          Developer and deployment scripts
|- docs         Documentation
|- public       Public assets
|- src          Client app
|  |- api             Interface with the Twine HTTP API
|  |- shared          All code shared between the admin and visitor UIs
|  |  |- assets
|  |  |- components
|  |  |- hoc
|  |  |- ...
|  |  |- index.ts     Defines public interface of `shared` module
|  |- styles          Stylesheets for external components or other things not compatible with Style Components
|  |- App.tsx
|  |- index.tsx
|- ...dotfiles
|- package.json
|- README.md
```

### Tests

Adhere to the `jest` convention of having a `__tests__` directory colocated with all files under-test. For example:

```
./foo
|- __tests__
|  |- foobar.test.js
|  |- index.test.js
|- foobar.js
|- index.js
```

