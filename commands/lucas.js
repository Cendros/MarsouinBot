const Discord = require('discord.js');

module.exports = {
	name: 'lucas',
	aliases: ['lucas'],
	description: "Espionne Lucas pour savoir ce qu'il fait.",
	usage: '',
	ownerOnly: false,
	guildOnly: true,
	listable: true,
	async run(client, message, args) {
		let user = client.users.cache.get("262907775162646528");
		if(!user) return message.reply(getActivite());
		message.channel.send("Je vais espionner Lucas, je reviens.");
		return user.send(message.author.username + " veut savoir ce que tu fais.")
  		.then((newmsg) => {
    		newmsg.channel.awaitMessages(response => response.content, {
				max: 1,
				time: 60000,
				errors: ['time'],
    		}).then((collected) => {
      			message.reply(collected.first().content);
				newmsg.channel.messages.fetch({ limit: 1 }).then(messages => {
					messages.first().react('✅');
				})
				.catch(console.error);
    		}).catch(() => {
      			
				message.reply(getActivite());
    		});
  		});
	},
};

function getActivite() {
	let today = new Date();
	let hour = (today.getHours() + 2 )% 24;
	let actions = ["Lucas est probablement en train de dormir", "Lucas est sûrement parti manger", "Je pense que Lucas ne fait pas grand chose actuellement", "Lucas fait son goûter", "Lucas flip des burgers"];
	let edt = [2,2,0,0,0,0,0,0,0,0,2,2,1,4,2,2,3,3,2,2,1,4,2,2,2];
	return actions[edt[hour]];
}