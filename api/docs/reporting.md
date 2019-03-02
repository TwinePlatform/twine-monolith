# Reporting

For user analytics purposes, we'll occasionally want to generate reports containing pre-defined statistics of interest from the database.

The code used to generate all these reports is located in the `/reporting` directory. Each individual report is defined in the `/reporting/reports` directory. To run a report, use the `exec` script, and pass the path of the report relative to the `/reports` directory. For example:

```
$ npm run exec ./reporting/cli.ts cb_engagement/overview.ts
```
