# PyE Community - README

[![Discord](https://img.shields.io/discord/768278151435386900?color=7289da&label=Join%20Us%20on%20Discord&logo=discord&logoColor=white)](https://discord.gg/programacion)
[![GitHub](https://img.shields.io/github/license/pye-community/pye-community-bot)](https://github.com/pye-community/pye-community-bot)

Welcome to the PyE Community! Our Discord bot is designed to enhance your experience on [discord.gg/programacion](https://discord.com/invite/programacion) by providing valuable features and assistance to our members.

## Getting Started

Attention, if you use prettier you must disable the plugin in the folder, prettier is not used and its use is not recommended. 

Follow these simple steps to run the PyE Community bot on your server:

1. **Install Dependencies:** We recommend using [pnpm](https://pnpm.js.org/) as the package manager for this project. Install dependencies with your preferred package manager:

   ```bash
   pnpm install
   ```

2. **Create a Configuration File:** In the root directory of the project, create a `.env` file and provide the following details:

   ```env
   DISCORD_CLIENT_ID=""
   DISCORD_GUILD_ID=""
   DISCORD_SECRET=""

   DATABASE_URL=""

   NODE_ENV="development" # (optional)
   ```

3. **Start the monorepo:** Run the following command to start the monorepo:

   ```bash
   pnpm dev
   ```

## Contributing

We value contributions from our community members. If you have any ideas or improvements, please open an issue to discuss them before submitting a pull request.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/). Feel free to use and modify it according to your needs.

---
