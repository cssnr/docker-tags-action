# Contributing

You should be using an IDE, otherwise start there...

Formatting (this is done by you):

- Black (.py)
- Prettier (.yml;.yaml;.json;.md)

Linting (this is checked by actions):

- Flake8 (.py)
- ShellCheck (.sh)

## Running Locally

1. Install project: `npm install`
2. Watch build: `npm run build:watch`
3. Install `act`: https://nektosact.com/installation/index.html
4. Run: `act -j test`

To see all available jobs run: `act -l`
