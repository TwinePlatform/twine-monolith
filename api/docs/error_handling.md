# Error Handling

This documents the agreed conventions on error handling in the twine-api application (see [#176](https://github.com/TwinePlatform/twine-api/issues/176)).

## Types of Error
A **programmer error** is a bug. The only way it can be resolved is with a change to the code. It is by definition unanticipated, and can leave the application in an unknown state. Applications should not attempt to recover from these.

An **application error** is caused by external factors (disk/network failures, bad user input). They are routine and should be anticipated and handled explicitly.

## Types
The type system should be designed to avoid as much explicit error handling as possible.

## Synchronous code
Synchronous code is unlikely to need to respond directly to a failure of an external factor because these tend to be asynchronous in Node.js.

Invalid inputs should be dealt with by the type system where possible, and where not possible should result in thrown exception.

Programmer errors should result in a thrown exception.

## Asynchronous code
Asynchronous code should use rejected promises to represent both **programmer errors** and **application errors**, and leave the calling code to differentiate between them (see [Bounce](#bounce) for more on this).

Invalid inputs should be dealt with by the type system where possible, and where not possible should result in thrown exception.

Programmer errors should result in a thrown exception.

## [Bounce](https://github.com/hapijs/bounce)
Use the bounce module to differentiate between **programmer errors** and **application errors**.

## Custom Errors
Where useful, modules should sub-class the `Error` object to form their own in order to provide more context to the caller and allow easier differentiation of errors using [`bounce`](#bounce).

## Specific patterns
This section gives general guidelines for specific cases:
1. Functions that retrieve a single resource
   * return `null` if the inputs are valid but return no results
   * throw if inputs invalid or result in failure in called code (programmer error)
2. Functions that retrieve a collection of resources
   * return empty collection (`[]` or `{}`) if inputs are valid but return no results
   * throw if inputs invalid or result in failure in called code (programmer error)
3. Functions that create resources
   * throw if inputs invalid or result in failure in called code (programmer error)
4. Functions that mutate or destroy a single resource
   * should not treat the degenerate case differently
     * degeneracy means the identity transformation (`x => x`), or a no-op (`x => {}`)
   * should throw if query targets multiple resources (programmer error)
   * throw if inputs invalid or result in failure in called code (programmer error)
5. Functions that mutate several resources
   * should not treat the degenerate case differently
     * degeneracy means the identity transformation (`x => x`), or a no-op (`x => {}`)
   * throw if inputs invalid or result in failure in called code (programmer error)
6. [`bounce`](#bounce) should be used to catch application errors but re-throw programmer errors
7. System errors ([see here](https://github.com/hapijs/bounce/blob/2b21702a6954c857f00c5a9c88963c8d5197f7f4/lib/index.js#L14-L28)) should not be replaced by application errors unless there's a _very_ good reason
8. Handlers should only wrap calls in `try/catch` if:
   * they anticipate an application error could be thrown
   * they need to perform some clean-up before propagating a system error up the stack
