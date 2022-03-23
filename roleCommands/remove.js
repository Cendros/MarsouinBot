const Discord = require('discord.js');
let utils = require('./utils.js');

module.exports = {
	name: 'remove-role',
	aliases: ['remove-role'],
	description: "Enlève un rôle à l'utilisateur",
	usage: '<[user] role>',
	ownerOnly: false,
	guildOnly: true,
	listable: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("Nom du rôle manquant !");
		let role;
		let toRemove;
			toRemove = message.guild.member(client.getUserFromMention(args[0]));
		if (toRemove) {
			if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission d'enlever un rôle à quelqu'un !")
			args.shift();
		}
		let arg = args.join(" ");
		role = utils.getRole(message, arg);
		if (role == null)
			return message.channel.send("Ce rôle n'existe pas !");
		if (role.color != 15277667) return message.channel.send("Vous ne pouvez pas enlever ce rôle !\nAffichez la liste des rôles disponibles avec \`!mrs roles\`");
		if (toRemove) {
			if (!toRemove.roles.cache.some(r => r == role)) return message.channel.send("L'utilisateur ne possède pas ce rôle !");
			toRemove.roles.remove(role).catch(console.error);
		} else {
			if (!message.member.roles.cache.some(r => r == role)) return message.channel.send("Vous ne possédez pas ce rôle !");
			message.member.roles.remove(role).catch(console.error);
		}
		return message.channel.send("Rôle enlevé :white_check_mark:")
	},
};