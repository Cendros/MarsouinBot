const Discord = require('discord.js');
var request = require('request');

module.exports = {
	name: 'lol-status',
	aliases: ['lol-status'],
	description: "Donne l'état du jeu",
	usage: '<>',
	ownerOnly: false,
	guildOnly: true,
	listable: true,
	async run(client, message, args) {
		let data = await requestStatus();
		if(data == null)
			return message.channel.send("Y'a rien");
		
		if(data['maintenances'].length == 0 && data['incidents'].length == 0)
			return message.channel.send("Y'a rien");;

		let statusEmbed = new Discord.MessageEmbed()
				.setColor('RANDOM');

		if(data['maintenances'].length != 0) {
			let maintenances = data['maintenances'][0]['updates'][0]['translations'];
			statusEmbed.addFields({ name: findFr(data['maintenances'][0]['titles']), value: findFr(maintenances)});
		}

		if(data['incidents'].length != 0) {
			let incidents = data['incidents'][0]['updates'][0]['translations'];
			statusEmbed.addFields({ name: findFr(data['incidents'][0]['titles']), value: findFr(incidents)});
		}

		return message.channel.send({ embed: statusEmbed });
	},
};

function doRequest(url) {
	return new Promise(function (resolve, reject) {
    	request(encodeURI(url), function (error, res, body) {
    		if (!error && res.statusCode == 200) {
    			resolve(body);
      		} else {
        		reject(error);
     		}
    	});
  	});
}

async function requestStatus() {
    let url = "https://euw1.api.riotgames.com/lol/status/v4/platform-data?api_key=" + process.env['apiKey'];
	let data = await doRequest(url);
	if(data == null) return
	
	data = JSON.parse(data);
	return data;
}

function findFr(data) {
	for (let i in data) {
		if(data[i]['locale'] == 'fr_FR')
			return data[i]['content'];
	}
}