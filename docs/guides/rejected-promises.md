# Catching Rejected Promises

The middleware dispatches rejected actions, but does not catch the rejected promise. As a result, you may get a "uncaught" rejected promise warning in the console. This is expected behavior for promises and not something the middleware can handle.

To catch promise errors, you can employ two solutions:

1. [Middleware](/global-error-handling.md): Catch the rejected promise "globally" in a middleware
2. [Action Creator](/local-error-handling.md): Catch the rejected promise "locally" at the action creator


Consider the problem from issue #69:

> We would like to always dispatch a logout action when ever we get a 401 back from our API. Likewise, I would like to have a global error action dispatched for every 500> response we get back.

<!--In this case, you may want to employ a mixture of both global and local error handling. For example, it will make sense to use local error handling to directly control the "side-effect" of the error. This can be done by dispatching some specific action. In other cases, for example, you may want to show the error in a modal. Since the modal is a global component, it would make sense to catch the error in a middleware. You can then dispatch the action to show the modal in the middleware. There is more information on how these solutions work in the documentation for each.

One may want to dispatch actions or notify users in the user-interface layer of an application when an error occurs or when a network request is made. In most cases, it makes sense to implement this functionality globally. For example, when _any_ error occurs, show a message. When _any_ network request occurs, show a spinner.-->
