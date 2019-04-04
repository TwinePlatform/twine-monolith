# Development Checklist

This is a checklist of things to think about before considering your piece of work "done".

## Adding New Features
* [ ] Have I manually tested my new feature?
* [ ] Is my new feature sufficiently well tested?
* [ ] Have I updated the project documentation and README to reflect my changes?
* [ ] Does the new feature conform to the desired project architecure?

## Updating Existing Features
* [ ] Have I manually tested my changes?
* [ ] Have I added/removed/updated the test suite for this feature appropriately?
* [ ] Have I updated the project documentation and README to reflect my changes?
* [ ] Do my changes affect steps towards the desired project architecture?

## Fixing Bugs
* [ ] Have I added a (set of) test(s) that proves the bug is fixed?
* [ ] Have I documented any necessary developer notes/gotchas/lessons learnt from this bug fix?

## Reviewing a PR
* [ ] Have I manually tested the feature(s)?
* [ ] Have I understood the changes?

## Writing Tests
* [ ] Have I fully covered code paths that:
  * contain application-critical logic?
  * are run most frequently?
* [ ] Does each test case exercise one (and only one) self-contained scenario?
* [ ] Does each test case descriptor adequately describe that scenario?

## Reporting Errors
* Before reporting
  * [ ] Have I tried to understand the error message?
  * [ ] Have I tried to understand the stack-trace?
  * [ ] If the error is a result of a network error, have I understood:
    * The response status code?
    * The response body?
    * What's wrong (if anything) with the request?
  * [ ] If the network error comes from my server, have I understood:
    * The stack-trace (if any)?
    * The part of the server-side codebase that generates the error?
  * [ ] Have I checked that my application and environment is correctly configured?
* When reporting
  * [ ] Have I posted the error message?
  * [ ] Have I posted the stack-trace?
  * [ ] Have I posted my application and environment configuration?
