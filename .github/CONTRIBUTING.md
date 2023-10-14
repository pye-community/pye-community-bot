# Contributing

When contributing to this repository, please first discuss the change you wish to make via [GitHub](https://github.com/pye-community/pye-community-bot) with the owners of this repository before submitting a Pull Request.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) and follow it in all your interactions with the project.

## Local development

This project is configured in a monorepo, where one repository contains multiple npm packages. Dependencies are installed and managed with `pnpm`, not `npm` CLI.

To get started, execute the following:

```
git clone https://github.com/pye-community/pye-community-bot
cd pye-community-bot
pnpm install
pnpm build
pnpm lint
```

Make sure all the tests pass before making changes.