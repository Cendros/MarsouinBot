const Discord = require('discord.js');
var request = require('request');
var version = "11.1.1"

module.exports = {
	name: 'mastery',
	aliases: ['mastery'],
	description: 'Affiche les points de maitrises totaux du joueurs',
	usage: '<invocateur>',
	ownerOnly: false,
	guildOnly: true,
	listable: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("Nom d'invocateur manquant !");
		let summonerName = args.join(" ")

		//ID de l'invocateur
		let id = await requestSummonerData(summonerName);
		if (id == null)
			return message.channel.send("Cet invocateur n'existe pas !");
		//Récupération des maitrises
		let masteries = await requestMastery(id);
		let somme = 0;
			for(let i = 0; i < masteries.length; i++) {
				somme += masteries[i]["championPoints"];
			}
			let top3 = [];
			let championList = await getChampList();
			championList = championList["data"];
			//top 3
			for (let i = 0; i < 5; i++) {
				let championName;
				let champion = masteries[i];
				for (c in championList) {
					if (championList[c].key == champion["championId"]) {
						championName = championList[c].id == "MonkeyKing" ? "Wukong" : championList[c].id;
						break;
					}
				}
				top3.push(championName + " : " + champion["championPoints"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
			}
			
			//Message
			maitriseEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setAuthor('Points de maitrise', client.user.avatarURL())
			.addFields({ name: 'Total : ', value: somme.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") },
			{ name: 'Top 5 : ', value:  top3.join("\n")}
			);
			message.channel.send({ embed : maitriseEmbed });
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
	if(data != null) {
		let list = JSON.parse(data);
		return list['id'];
	}
}

async function requestMastery(id){
    let url = "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + id + "?api_key=" + process.env['apiKey'];
	let data = await doRequest(url);
	return JSON.parse(data);
}

async function getChampList() {
	url = 'http://ddragon.leagueoflegends.com/cdn/' + version + '/data/en_US/champion.json';
		let data = await doRequest(url);
		return JSON.parse(data);
}
