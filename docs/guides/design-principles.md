# Design Principles

## Promise Objects Are State Machines

A promise object is a "machine" holding one of two states:

1. Pending
2. Settled

A settled state is the deffered result of the promise. This state will be either (a) rejected or (b) resolved. The rejected state throws an error and the fulfilled state returns either null or a value.

See more: [ECMAScript 25.4 Spec: Promise Objects](https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects).

## Action Objects Describe State Changes to the Store

An action object describes changes to the store. Actions are the only source of information for the store.

See more: [Redux Documentation](http://redux.js.org/docs/basics/Actions.html).

## Asynchronous Action Objects Describe the Promise Object State

Promise middleware dispatches "asynchronous" action objects describing the state of the promise:

1. Pending action
2. Fullfilled or rejcted action (settled)

This affords asynchronous updates to the store.

Another way of thinking of this is promise middleware abstracts the two states of an promise object to two action objects.

## Use Flux Standard Action (FSA)

Promise middleware dispatches actions in compliance with [the Flux Standard Action](https://github.com/acdlite/flux-standard-action) reccommendations.
