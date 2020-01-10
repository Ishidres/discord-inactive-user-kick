const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require("fs");
const config = require("./config.json");
const package = require("./package.json");

var saved_users = {};

// import savedUsers.json if it exists already
if (fs.existsSync(__dirname + "/savedUsers.json"))
  saved_users = JSON.parse(fs.readFileSync("./savedUsers.json", "utf8"));

client.on('ready', () => {
  console.log(new Date() + ": Logged in as " + client.user.tag);
});

client.on('message', message => {
  // Don't kick bots
  if (message.author.bot) return;

  // reply when receiving !help in direct message
  if (message.channel.type === "dm") {
    if (!!message.content) {
      if (message.content.toLowerCase().startsWith("!help"))
        message.reply("This bot doesn't offer any commands and has to be set up manually."
        + "\nPlease refer to " + package.homepage + " for more information.");
    }

    return;
  }

  if (!saved_users[message.author.id])
    saved_users[message.author.id] = {};

  saved_users[message.author.id].lastMessage = new Date().getTime();
  saved_users[message.author.id].guild = message.guild.id;
  console.log(new Date() + ": Message received by " + message.author.tag);

  // Save the data
  fs.writeFileSync("./savedUsers.json", JSON.stringify(saved_users));
});

// checking for users to kick every 10 minutes (600 000 ms)
setInterval(function () {
  var now = new Date().getTime();

  Object.keys(saved_users).map(function (i) {
    if (now - saved_users[i].lastMessage >= config.maxInactivity) {
      console.log(new Date() + ": Kicking User " + i + " due too inactivity.");
      var guild = client.guilds.get(saved_users[i].guild);

      guild.fetchMember(i).then(member => {
        member.kick("Kicked due too inactivity.");
      });

      delete saved_users[i];
      fs.writeFileSync("./savedUsers.json", JSON.stringify(saved_users));
    }
  });
}, 60*1000);

client.login(config.token);