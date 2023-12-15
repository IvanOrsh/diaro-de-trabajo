# Unrelated stuffs that might be useful

## husky hooks

`npx husky add .husky/<....> "..."`

## commitlint

`npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ""'`

## prisma: reset & push - recreate db

`npx prisma migrate reset`
`npx prisma db push`

## fetcher.type

| type                       | state      | data     | method |
| -------------------------- | ---------- | -------- | ------ |
| init                       | idle       | null     | -      |
| done                       | idle       | not null | -      |
| actionSubmission           | submitting | null     | POST   |
| loaderSubmission           | submitting | null     | GET    |
| actionReload               | loading    | not null | POST   |
| actionRedirect ???not sure | loading    | not null | POST   |
| normalReload               | loading    | not null | GET    |

```ts
function Component() {
  const fetcher = useFetcher();

  // fetcher.type === "init"
  const isInit = fetcher.state === "idle" && fetcher.data == null;

  // fetcher.type === "done"
  const isDone = fetcher.state === "idle" && fetcher.data != null;

  // fetcher.type === "actionSubmission"
  const isActionSubmission = fetcher.state === "submitting";

  // fetcher.type === "actionReload"
  const isActionReload =
    fetcher.state === "loading" &&
    fetcher.formMethod != null &&
    fetcher.formMethod != "GET" &&
    // If we returned data, we must be reloading
    fetcher.data != null;

  // fetcher.type === "actionRedirect"
  const isActionRedirect =
    fetcher.state === "loading" &&
    fetcher.formMethod != null &&
    fetcher.formMethod != "GET" &&
    // If we have no data we must have redirected
    fetcher.data == null;

  // fetcher.type === "loaderSubmission"
  const isLoaderSubmission =
    fetcher.state === "loading" && fetcher.formMethod === "GET";

  // fetcher.type === "normalLoad"
  const isNormalLoad =
    fetcher.state === "loading" && fetcher.formMethod == null;
}
```
