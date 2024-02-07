const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});
require("dotenv").config();
const token = process.env.token;
const db = require("./db.js");

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}`);
  client.user.setStatus(Discord.PresenceUpdateStatus.Idle);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const serverid = message.guild.id;
  const data = await db.findOne({ id: serverid });
  if (!data) {
    const newData = new db({
      id: serverid,
      prefix: ";",
    });
    await newData.save();
  }

  const prefix = data?.prefix ? data?.prefix : ";";

  if (!message.content.startsWith(prefix)) return;

  const [command, ...args] = message.content
    .trim()
    .substring(prefix.length)
    .split(/\s+/);

  const commandsFolder = fs.readdirSync("./commands");
  const commandFile = commandsFolder.find((file) => file.startsWith(command));
  if (!commandFile) return;

  const commandHandler = require(`./commands/${commandFile}`);
  commandHandler.run(client, message, args);
});

client.login(token);
