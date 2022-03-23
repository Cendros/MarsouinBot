module.exports = {
	name: '2023',
	aliases: ['2023'],
	description: "Affiche le nombre de jours avant 2023.",
	usage: '',
	ownerOnly: false,
	guildOnly: false,
	listable: true,
	run(client, message, args) {
		let d2023 = new Date("01/01/2023");
		let today = new Date();
		let dif = d2023 - today;
		let days = dif / (1000 * 3600 * 24);
		message.channel.send('Il reste ' + parseInt(days) + ' jours avant 2023 !');
	},
};