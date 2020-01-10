# Discord Inactive User Kick
A simple Discord bot to automatically kick inactive server members created for [this](https://www.reddit.com/r/discordapp/comments/emgcn9/bot_for_kicking/) reddit post.

## Setup
- create a new Discord bot [here](https://discordapp.com/developers/applications/)
- add the bot's token to `config.json`
- run the bot by using `nohup node index.js &` or any other command you prefer

## Flaws
- the bot only kicks users which ever sent a message on the server
- when mass kicking users the bot might run into ratelimits
- the bot uses JSON as a "database" which is not recommended for big Discord servers with lots of members; In that case, please use MySQL.

Feel free to improve the bot using pull requests!

### License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/). For more information please have a look at the LICENSE file.