# Twine API

## Documentation
See [project documentation](./docs/README.md)


Sketch:
```ts
VolunteerLogs
  .bind(client)
  .get()
  .join((trx, l) => ({ organisation: Organisation.get(trx, { where: { id: l.id } }) }))
  .where()
  .limit(1)
  .map((l) => l.duration)

VolunteerLogs
  .bind(client)
  .add({ name: 'foo', email: 'eee@eee.com' })

Visitors(client)
  .get()
  .join((trx, u) => [
    'visits',
    VisitLogs(trx)
      .fromUser(u)
      .join((trx2, vl) => [
        'activity',
        VisitActivities(trx2)
          .fromVisit(vl)
          .join((trx3, va) => ['category', VisitCategories(trx3).fromActivity(va)])
      ])
  ])
  .whereBetween({ birthYear: [0, 10] })
  .map(Serialisers.visitorsWithVisits)


interface ModelObservable<T extends Model> extends Knex.QueryBuilder {
  join (cb: <K extends string, U>(trx: Knex.QueryBuilder, u: T) => [K, ModelObservable<U>]): ModelObservable<T & { [K]: ModelObservable<U> }>;
}
```
