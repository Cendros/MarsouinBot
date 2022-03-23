const Discord = require('discord.js');

module.exports = {
	name: 'chances',
	aliases: ['chances'],
	description: "Affiche la liste des chances de réponses",
	usage: '',
	ownerOnly: false,
	guildOnly: false,
	listable: true,
	run(client, message, args) {
		let embed = new Discord.MessageEmbed()
		.setColor('RANDOM')
		.addField('En envoyant un message, vous avez :', " - Une chance sur 20 000 d'être cringe\n - Une chance sur 19 068 840 de gagner au loto\n - Une chance sur 5 000 de vous faire ratio")
		message.channel.send({ embed });
	},
};