# Passing extra values to reducer

When returning an object from an action, only the payload and type attributes would be passed to the reducer.

Consider this example:

```
{
 type: 'ACTION`,
 payload: new Promise(),
 extraValue: 123
}
```

Here, reducer would not receive the `extraValue` property.
In order to pass extra attributes, you need to include it as part of the `meta` attribute.


```
{
 type: 'ACTION`,
 payload: new Promise(),
 meta: {extraValue: 123}
}
```
