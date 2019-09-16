# Twine API

## Documentation
See [project documentation](./docs/README.md)

# Models refactor proposal
This work can be split up into different parts.

## Directory structure
```
|- models
|  |- types
|  |  |- constants.ts
|  |  |- models.ts
|  |  |- queries.ts
|  |  |- records.ts
|  |- collections
|  |  |- users.ts
|  |  |- visitors.ts
|  |  |- volunteers.ts
|  |  |- cb_admins.ts
|  |  |- organisations.ts
|  |  |- community_businesses.ts
|  |  |- temp_community_businesses.ts
|  |  |- volunteer_activities.ts
|  |  |- volunteer_projects.ts
|  |  |- volunteer_logs.ts
|  |  |- visit_activities.ts
|  |  |- visit_logs.ts
|  |  |- single_use_tokens.ts
|  |  |- password_reset_tokens.ts
|  |  |- add_role_tokens.ts
|  |- utils
```

## Collection
Use of function signature overloading to allow methods to make use of more specific types. Sketch:
```
Collection {
  _toColumnNames;

  // Replaces "create"
  cast;

  serialise;

  exists

  // Uses presence of "fields" to determine whether returned object is `Partial` or not
  get (k: Knex, q?: ModelQuery<TModel>): Promise<TModel[]>;
  get (k: Knex, q?: ModelQueryPartial<TModel>): Promise<Partial<TModel>[]>;

  // As with `get`
  getOne (k: Knex, q?: ModelQuery<TModel>): Promise<Maybe<TModel>>;
  getOne (k: Knex, q?: ModelQueryPartial<TModel>): Promise<Maybe<Partial<TModel>>>;

  // Replaces "add": totally generic, DB layer logic.
  // Business logic to be moved to "add" method (e.g. creating roles, etc.)
  create (k: Knex, c: Partial<TModel>): Promise<TModel>;

  update

  // Soft-delete
  delete

  // Hard-delete
  destroy
}
```

## Splitting out collections & separating methods
- Volunteer projects collection
- Volunteer activities collection
- Tokens collection(s)
- Visit activities collections
- Visit logs collections
- Separate methods for different parts of visit log aggregation
- Specific `Visitor`, `Volunteer`, `CbAdmin` types (in addition to generic `User`) encoding which fields are required/optional for each type

For consideration:
1. Instead of storing ids and names on some types (e.g. `userId` and `userName` on `VolunteerLog`), store the entire object
  - This means it's up to the handler (and also `serialise`) to transform what's returned from the DB layer into the API response type
  - Decouples DB layer from API interface
2. Remove `serialise` and instead create specific serialisers where necessary for each specific situation (Django style)

For example, 1 would look like:
```ts
export interface VolunteerLog extends Readonly<CommonTimestamps> {
  readonly id: number;
  readonly user: Volunteer;
  readonly createdBy?: Volunteer | CbAdmin;
  readonly organisation: Organisation;
  readonly activity: VolunteerActivity;
  readonly project?: VolunteerProject;
  readonly duration: Duration.Duration;
  readonly startedAt: Date;
}
```
