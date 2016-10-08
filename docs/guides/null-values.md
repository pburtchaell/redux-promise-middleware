# Null Values

As discussed on [PR #121](https://github.com/pburtchaell/redux-promise-middleware/pull/121), if a promise is resolved with a `null` or `undefined` value, the fullfilled action will not include a payload property. This is because actions describe changes in state. Consider the following two actions:

```
// A
{
 type: 'ACTION`,
 meta: ...
}

// B
{
 type: 'ACTION'
 payload: null,
 meta: ...
}
```

Objectively, **one could argue both actions describe the same change in state**. This is why, when you resolve with `null` or `undefined`, the payload property is not included. It would be redundant to include it.

If you believe this is illogical and would like to discuss further, please open a feature request issue.
