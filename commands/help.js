const Discord = require('discord.js');

module.exports = {
	name: 'help',
	aliases: ['help', 'commands', 'cmds'],
	description: "Affiche la liste des commandes",
	usage: '<commandName>',
	ownerOnly: false,
	guildOnly: false,
	listable: true,
	run(client, message, args) {
		function sendHelp() {
			let roleFilter = [];
			client.roleCommands.forEach(x => {
				if(x.listable) roleFilter.push(getCommande(x));
			});
			let roleCmds = roleFilter.join('\n');

			let lolFilter = [];
			client.lolCommands.forEach(x => {
				if(x.listable) lolFilter.push(getCommande(x));
			});
			let lolCmds = lolFilter.join('\n');

			let diversFilter = [];
			client.diversCommands.forEach(x => {
				if(x.listable) diversFilter.push(getCommande(x));
			});
			let diversCmds = diversFilter.join('\n');

			helpEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setAuthor('Liste des commandes', client.user.avatarURL())
			.addFields({ name: 'Rôles', value: roleCmds, inline: true },
			{ name: 'Divers', value: diversCmds, inline: true },
			{ name: '\u200B', value: '\u200B' },
			{ name: 'League of Legends', value: lolCmds },
			{ name: '\u200B', value: '\u200B' },
			)
			.setFooter(`Pour plus d'informations sur une commande, utilisez \`${message.content.charAt(0)}mrs help <command name>\``);
			message.channel.send({ embed: helpEmbed });
		};
		if (!args.length) return sendHelp();
		commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName) || client.lolCommands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || client.lolCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		let embed = new Discord.MessageEmbed()
		.setColor('RANDOM')
		.setTitle(`Commande : ${command.name}`)
		.addField('Description', command.description || "None set");
		if(command.usage != '')
			embed.addField('Utilisation', command.usage || "none set", true);
		message.channel.send({ embed });
	},
};

function getCommande(commande) {
	let name = commande.name.toString();
	if(commande.roleOnly)
		name += ' :lock:';
	return name;
}