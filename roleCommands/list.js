const Discord = require('discord.js');

module.exports = {
	name: 'roles',
	aliases: ['roles'],
	description: 'Affiche la liste des rôles',
	usage: '<>',
	ownerOnly: false,
	guildOnly: true,
	listable: true,
	async run(client, message, args) {
		let list = [];
		console.log(message.guild.roles.cache);
		message.guild.roles.cache.forEach(r => {
			if (r.color == 15277667) list.push(r.name)
		});
		if (list.length == 0) return message.channel.send("Il n'y a aucun rôle D:");
		let roles = list.map((i) => `${i}`).join("\n");
		listEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setAuthor('Liste des rôles', client.user.avatarURL())
			.setDescription(`${roles}`);
			message.channel.send({ embed: listEmbed });
	},
};