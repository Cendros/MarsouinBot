const Discord = require('discord.js');
let utils = require('./utils.js');

module.exports = {
	name: 'add-role',
	aliases: ['add-role'],
	description: "Ajoute un rôle à l'utilisateur",
	usage: '<[user] role>',
	ownerOnly: false,
	guildOnly: true,
	listable: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("Nom du rôle manquant !");
		let role;
		let toAdd;
			toAdd = message.guild.member(client.getUserFromMention(args[0]));
		if (toAdd) {
			if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission d'ajouter un rôle à quelqu'un !")
			args.shift();
		}
		let arg = args.join(" ");
		role = utils.getRole(message, arg);
		if (role == null)
			return message.channel.send("Ce rôle n'existe pas !");
		if (role.color != 15277667) return message.channel.send("Vous ne pouvez pas ajouter ce rôle !\nAffichez la liste des rôles disponibles avec \`!mrs roles\`");
		if (toAdd) {
			if (toAdd.roles.cache.some(r => r == role)) return message.channel.send("L'utilisateur possède déjà ce rôle !");
			toAdd.roles.add(role).catch(console.error);
		} else {
			if (message.member.roles.cache.some(r => r == role)) return message.channel.send("Vous possédez déjà ce rôle !");
			message.member.roles.add(role).catch(console.error);
		}
		return message.channel.send("Rôle ajouté :white_check_mark:")
	},
};