const Discord = require('discord.js');
const aram = require('../tier_list.json');
let urf = require('../tier_list_urf.json');

module.exports = {
	name: 'tier',
	aliases: ['tier'],
	description: 'Affiche le tier du champion',
	usage: '<champion>',
	ownerOnly: false,
	guildOnly: true,
	listable: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("Nom du champion manquant !");
		champion = args.join(" ");
		champion = champion.charAt(0).toUpperCase() + champion.slice(1)

		let champ = champion == "Wukong" ? "MonkeyKing" : champion;
		
		let aramTier = aram[champion];
		let urfTier = urf[champion];
		if (aramTier == null) return message.channel.send("Ce champion n'existe pas !");
		tierEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(champion)
			.setThumbnail('https://opgg-static.akamaized.net/images/lol/champion/' + champ + '.png')
			.addFields({ name: 'ARAMㅤ', value: ":regional_indicator_" + aramTier.toLowerCase() + ":", inline: true },
			{ name: 'URF', value: ":regional_indicator_" + urfTier.toLowerCase() + ":", inline: true });
		return message.channel.send({ embed: tierEmbed });

	},
};