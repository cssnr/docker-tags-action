# Contributing

> [!WARNING]  
> This guide is a work in progress and may not be complete.

You should be using an IDE, otherwise start there...

Formatting (this is done by you):

- Black (.py)
- Prettier (.yml;.yaml;.json;.md)

Linting (this is checked by actions):

- Flake8 (.py)
- ShellCheck (.sh)

## Building

Before you submit a PR you must make sure the app is built and committed to the repository.

```shell
npm install
npm run build
```

## Testing Locally

To run actions locally you need to install act: https://nektosact.com/installation/index.html

```shell
npm install
npm run build:watch
act -j test -e event.json
```

To see all available jobs run: `act -l`

For advanced using with things like secrets, variables and context see: https://nektosact.com/usage/index.html
