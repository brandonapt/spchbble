const database = require('../db.js');
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send('you need to provide a prefix');
    }

    const newPrefix = args[0];
    const serverid = message.guild.id;

    const data = await database.config.findOne({ id: serverid });
    if (data) {
        data.prefix = newPrefix;
        data.save();
    } else {
        const newData = new database.config({
            id: serverid,
            prefix: newPrefix,
        });
        newData.save();
    }

    message.channel.send(`prefix has been set to \`${newPrefix}\``);
}