const Discord = require('discord.js');
var request = require('request');

module.exports = {
	name: 'rank',
	aliases: ['rank'],
	description: "Donne le rank d'un joueur",
	usage: '<>',
	ownerOnly: false,
	guildOnly: true,
	listable: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("Nom d'invocateur manquant !");
		let summonerName = args.join(" ")

		let id = await requestSummonerData(summonerName);
		if (id == null)
			return message.channel.send("Cet invocateur n'existe pas !");

		let rank = await requestRank(id);

		let solo = "Unranked";
		let flex = "Unranked";
		for(item in rank) {
			let str;
			if(rank[item]["queueType"] == "RANKED_SOLO_5x5") {
				solo = rank[item]["tier"] + " " + rank[item]["rank"]
				+ " " + rank[item]["leaguePoints"] + "LP ("
				+ rank[item]["wins"] + "V/" + rank[item]["losses"] + "D)";
				if(rank[item]["hotStreak"])
					solo += " :fire:";
				if(rank[item]["inactive"])
					solo += " :coffin:";
			}
			if(rank[item]["queueType"] == "RANKED_FLEX_SR") {
				flex = rank[item]["tier"] + " " + rank[item]["rank"]
				+ " " + rank[item]["leaguePoints"] + "LP ("
				+ rank[item]["wins"] + "V/" + rank[item]["losses"] + "D)";
				if(rank[item]["hotStreak"])
					flex += " :fire:";
				if(rank[item]["inactive"])
					flex += " :coffin:";
			}
		}

		rankEmbed = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.addFields({ name: 'Solo/Duo', value: solo },
				{ name: 'Flexible', value: flex });
				message.channel.send({ embed: rankEmbed });
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

async function requestSummonerData(summonerName) {
    let url = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + process.env['apiKey'];
	let data = await doRequest(url);
	if(data == null) return
	
	let list = JSON.parse(data);
	return list['id'];
}

async function requestRank(id) {
    let url = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + id + "?api_key=" + process.env['apiKey'];
	let data = await doRequest(url);
	if(data == null) return
	
	data = JSON.parse(data);
	return data;
}