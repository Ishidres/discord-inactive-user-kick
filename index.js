const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require("fs");
const config = require("config.json");
const package = require("package.json");

var saved_users = {};

// import savedUsers.json if it exists already
if (fs.existsSync(__dirname + "/savedUsers.json"))
  saved_users = JSON.parse("./savedUsers.json");

client.on('ready', () => {
  console.log(new Date() + ": Logged in as " + client.user.tag);
});

client.on('message', message => {
  // Don't kick bots
  if (message.author.bot) return;

  // reply when receiving !help in direct message
  if (message.channel.type === "dm" && !!message.content) {
    if (message.content.toLowerCase().startsWith("!help"))
      return message.reply("This bot doesn't offer any commands and has to be set up manually. Please refer to " + package.homepage + " for more information.");
  }

  if (!saved_users[message.author.id])
    saved_users[message.author.id] = {};

  saved_users[message.author.id].lastMessage = new Date().getTime();
  console.log(new Date() + ": Message received by " + message.author.tag);

  // Save the data
  fs.writeFileSync("./savedUsers.json", JSON.stringify(saved_users));
});

// checking for users to kick every 10 minutes (600 000 ms)
setInterval(function () {
  Object.keys(saved_users).map(function () {
    // TODO
  });
}, 600000)

client.login(config.token);