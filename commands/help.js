const db = require("../db.js");
const fs = require("fs");
module.exports.run = async (client, message, args) => {
  const serverid = message.guild.id;
  const data = await db.findOne({
    id: serverid,
  });

  const prefix = data?.prefix ? data?.prefix : ";";

  const commandsFolder = fs.readdirSync("./commands");
  // map the commands
  const commands = commandsFolder.map((file) => {
    return prefix + file.split(".")[0];
  });

  message.channel.send(
    `here are the commands you can use: \`${commands.join(", ")}\``
  );
};
