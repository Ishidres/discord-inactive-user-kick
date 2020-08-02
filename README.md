# Discord Inactive User Kick
A simple Discord bot to automatically kick inactive server members created for [this](https://www.reddit.com/r/discordapp/comments/emgcn9/bot_for_kicking/) reddit post.

## Setup
- install [Node.js](https://nodejs.org/en/)
- install [discord.js@11.6.4](https://www.npmjs.com/package/discord.js/v/11.6.1) using `npm i discord.js@11.6.4`
- create a new Discord bot [here](https://discordapp.com/developers/applications/)
- add the bot's token to `config.json` and adjuste the configuration
- run the bot by using `nohup node index.js &` or any other command you prefer

Note: The bot uses JSON as a "database" which is not recommended for very large Discord servers with lots of members In that case, please use MySQL. Servers with under 100K users can ignore this warning.

Feel free to improve the bot using pull requests!

### Questions
You can ask Ishidres, the bot's developer, for help if you need it. Use their [website](https://ishidres.eu) to contact them.

### License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/). For more information please have a look at the LICENSE file.
