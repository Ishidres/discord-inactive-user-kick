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

  if (client.guilds.array().length > 1) {
    console.log("WARNING: The bot has been added to " + client.guilds.array().length + " servers but should only be used on one server at once and will now shutdown. Please remove the bot from all servers but one and restart it!");
    process.exit();
  }
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
  var actions = 0;
  var all_users = client.users.array();

  // Save all users
  for (y=0; y<all_users.length; y++) {
    // Prevent ratelimits
    if (actions >= 5)
      return;

    if (all_users[y].id.length < 10)
      continue;

    if (!saved_users[all_users[y].id])
      saved_users[all_users[y].id] = {
        lastMessage: new Date().getTime(),
        guild: client.guilds.array()[0].id
      }
  }

  Object.keys(saved_users).map(function (i) {
    // Prevent ratelimits
    if (actions >= 5)
      return;

    var diff = now - saved_users[i].lastMessage;
    var user = client.users.get(i);
    var channel = client.channels.get(config.warnMessagesChannel);

    if (!user) {
      user = "UserIsOffline#0000";
    } else {
      user = user.tag;
    }

    if (diff >= config.warnDelay && saved_users[i].warned !== true) {
      console.log(new Date() + ": User " + i + " will be kicked in " + config.warnDelay + " ms.");

      if (!!channel)
        channel.send(":warning: User " + user + " (ID: " + i + ") will be kicked in " + (config.warnDelay / 60 / 60 / 1000) + " minutes.");

      saved_users[i].warned = true;
      actions++;
    }

    if (diff >= config.maxInactivity) {
      console.log(new Date() + ": Kicking User " + i + " due to inactivity.");
      var guild = client.guilds.get(saved_users[i].guild);

      guild.fetchMember(i).then(member => {
        member.kick("Kicked due to inactivity.");

        if (!!channel)
          channel.send("🔨 " + member.user.tag + " has been kicked due to inactivity.");
      });

      actions += 2;
      delete saved_users[i];
      fs.writeFileSync("./savedUsers.json", JSON.stringify(saved_users));
    }
  });
}, 60*1000);

client.login(config.token);