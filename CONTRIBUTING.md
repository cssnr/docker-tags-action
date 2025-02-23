# Contributing

> [!WARNING]  
> This guide is a work in progress and may not be complete.

You should be using an IDE, otherwise start there...

Formatting:

- Black (.py)
- Prettier (.yml;.yaml;.json;.md)

Linting:

- ESLint (.js;.mjs)

## Workflow

1. Fork the repository.
2. Create a branch in your fork!
3. Run: `npm install`
4. Make your changes.
5. Build or watch: `npm run build:watch`
6. [Test](#Testing) your changes.
7. Ensure changes are built: `npm build`
8. Commit and push your changes (including `dist`).
9. Create a PR to this repository.
10. Verify the tests pass, otherwise resolve.
11. Make sure to keep your branch up-to-date.

## Testing

GitHub is easier to set up, but you have to push your commits to test.  
Running locally is harder to set up, but it is much easier to test; and by far recommended!

### GitHub

When you push your branch to your repository, the [test.yaml](.github/workflows/test.yaml) should run...

### Locally

To run actions locally you need to install act: https://nektosact.com/installation/index.html

1. Create a `.secrets` file with: `GITHUB_TOKEN="ghp_xxx"`

```shell
npm install
npm run build:watch
act -j test -e event.json
```

To see all available jobs run: `act -l`
