const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);
    }
    catch (err) {
        console.error(err);
    }
});

client.on('message', msg => {
    if(msg.content === "무한~") {
        msg.reply("무~야호~!");
    }
});

client.login(process.env.TOKEN);
