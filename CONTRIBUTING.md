# Contributing

You should be using an IDE, otherwise start there...

Formatting (this is done by you):

- Black (.py)
- Prettier (.yml;.yaml;.json;.md)

Linting (this is checked by actions):

- Flake8 (.py)
- ShellCheck (.sh)

## Running Locally

To run actions locally you need to install act: https://nektosact.com/installation/index.html

1. Install: `npm install`
2. Watch build: `npm run build:watch`
3. Run: `act -j test`

To see all available jobs run: `act -l`

For advanced using with things like secrets, variables and context see: https://nektosact.com/usage/index.html
