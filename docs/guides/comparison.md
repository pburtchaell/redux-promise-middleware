# What is the difference between this and other promise middleware?

In issue [#27](https://github.com/pburtchaell/redux-promise-middleware/issues/27), it was asked if this middleware is the same as [acdlite/redux-promise](https://github.com/acdlite/redux-promise).

Both middleware solve the same problem, but the implementation is different. This middleware dispatches a pending action in addition to a rejected or fulfilled action. This is a feature acdlite/redux-promise has not implemented at time of writing (November 2015). The pending action enables optimistic updates and describes an unsettled promise.

Both middleware do use the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) specification.

One could also argue the API for this middleware is more transparent and easier to integrate, e.g., you do not need to use [redux-actions](https://github.com/acdlite/redux-actions).
