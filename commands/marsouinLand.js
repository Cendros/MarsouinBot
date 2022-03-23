const Discord = require('discord.js');

module.exports = {
	name: 'marsouin-land',
	aliases: ['ml'],
	description: "Le lien vers Marsouin Land",
	usage: '',
	ownerOnly: false,
	guildOnly: false,
	listable: true,
	run(client, message, args) {
		return message.channel.send("https://marsouin-land.cendros.repl.co/");
	},
};