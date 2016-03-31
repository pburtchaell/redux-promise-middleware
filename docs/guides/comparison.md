# What is the difference between this and other promise middleware?

In issue [#27](https://github.com/pburtchaell/redux-promise-middleware/issues/27), it was asked if this middleware is the same as [acdlite/redux-promise](https://github.com/acdlite/redux-promise). The short answer is that while the middleware solve the same problem, the implementation is different.

The major difference is this middleware dispatches a `_PENDING` action. The pending action enables optimistic updates and provides an action one can use to update the user interface to inform the user a request is being made. This is a feature that acdlite/redux-promise has not implemented at time of writing this (November 2015). A similarity is that both middleware use the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) specification.

One could also argue the API for this middleware is more transparent and easier to integrate, e.g., you do not need to use [redux-actions](https://github.com/acdlite/redux-actions).
