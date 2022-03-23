const Discord = require('discord.js');

module.exports = {
	name: 'create-role',
	aliases: ['create-role'],
	description: 'Crée un rôle',
	usage: '<role name>',
	ownerOnly: false,
	guildOnly: true,
	roleOnly : true,
	listable: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("Nom du rôle manquant !");
		let role;
		roleName = args.join(" ")
		role = message.guild.roles.cache.find(r => r.name === roleName);
		if (role != null) return message.channel.send("Ce rôle existe déjà ! Ajoutez le avec \`!mrs add-role" + role.name + "\`");
		message.guild.roles.create({
		data: {
			name: roleName,
			color: 15277667,
			mentionable: true,
		},
		})
		.catch(console.error);
		return message.channel.send("Rôle créé :white_check_mark:")
	},
};