const Discord = require('discord.js');
var request = require('request');
const Canvas = require('canvas');
const fs = require('fs');

const tierList = require('../tier_list_urf.json');
var listChampions;

module.exports = {
	name: 'urf',
	aliases: ['urf'],
	description: 'Affiche le tier des équipes en URF',
	usage: '<pseudo>',
	ownerOnly: false,
	guildOnly: true,
	listable: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("Nom d'invocateur manquant !");
		let summonerName = args.join(" ");

		//ID de l'invocateur
		let id = await requestSummonerData(summonerName);
		if (id == null)
			return message.channel.send("Cet invocateur n'existe pas !");
		listChampions = await requestListChampions();
		let teams = await requestGameData(id);
		if (teams == null)
			return message.channel.send("Cet invocateur n'est pas en game !");
		
		let image = await makeImage(teams);
		const attachment = new Discord.MessageAttachment(image.toBuffer(), 'image.png');

		message.channel.send({ files: [attachment] });
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

async function requestGameData(summonerId) {
    let url = "https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + summonerId + "?api_key=" + process.env['apiKey'];
	let data;
	try {
		data = await doRequest(url);
	} catch (error) {
		return;
	}
	if(data == null) return;

	let list = JSON.parse(data);
	list = list['participants'];

	let bleue = [];
	for(let i = 0; i < 5; i++) {
		let championId = list[i]['championId'];
		let tier = getTier(championId);
		bleue.push({
			summonerName: list[i]['summonerName'],
			championId: championId,
			tier: tier
		});
	}
	let rouge = [];
	for(let i = 5; i < 10; i++) {
		let championId = list[i]['championId'];
		let tier = getTier(championId); 
		rouge.push({
			summonerName: list[i]['summonerName'],
			championId: championId,
			tier: tier
		});
	}

	return { bleue: bleue, rouge: rouge };
}

function getTier(id) {
	let champion = getChampion(id);
	if(champion == 'MonkeyKing') champion = 'Wukong';
	let tier = tierList[champion];
	if(tier == null) return 'N/A';
	return tier;
}

async function requestListChampions() {
	let url = "https://ddragon.leagueoflegends.com/api/versions.json";
	let versions = await doRequest(url);
	versions = JSON.parse(versions);
	if(versions == null) return;
	let latest = versions[0];

	url = "https://ddragon.leagueoflegends.com/cdn/"+ latest +"/data/en_US/champion.json";
	let champions = await doRequest(url);
	champions = JSON.parse(champions);
	if(champions == null) return;
	return champions['data'];
}

function getChampion(id) {
	for(champion in listChampions) {
		if(listChampions[champion]['key'] == id)
			return champion;
	}
}

function getTeamTier(score) {
	if(score == 5) return 'D-';
	if(score <= 7) return 'D';
	if(score <= 8) return 'D+';
	if(score <= 10) return 'C-';
	if(score <= 11) return 'C';
	if(score <= 13) return 'C+';
	if(score <= 14) return 'B-';
	if(score <= 15) return 'B';
	if(score <= 16) return 'B+';
	if(score <= 18) return 'A-';
	if(score <= 19) return 'A';
	if(score <= 21) return 'A+';
	if(score <= 22) return 'S-';
	if(score <= 24) return 'S';
	if(score == 25) return 'S+';
}

async function makeImage(teams) {
	let background;
	let tier;
	let summonerName;
	let tierBleu = teamTier(teams['bleue']);
	let tierRouge = teamTier(teams['rouge']);

	Canvas.registerFont('./fonts/Dela.ttf', { family: 'Dela' });

	const ratio = 1.5;
	const w = 940 / ratio;
	const h = 180 / ratio;
	const offset = w * 0.1;
	const textWidth = w * 0.3;

	const ratioTier = 0.8;
	const wTier = 159 / ratio * ratioTier; 
	const hTier = 180 / ratio * ratioTier;
	
	const canvas = Canvas.createCanvas(w * 2, h * 6 );
	const context = canvas.getContext('2d');
	let bgTier = await Canvas.loadImage('./images/bgTierURF.png');
	context.drawImage(bgTier, 0, 0, w * 2, h);

	tier = await Canvas.loadImage('./images/' + tierBleu[0] + '.png');
	if(tierBleu.length == 1) {
		context.drawImage(tier, w / 2 - wTier / 2, 0 + (h - hTier) / 2, wTier, hTier);
	} else {
		context.drawImage(tier, w / 2 - wTier, 0 + (h - hTier) / 2, wTier, hTier);
		tier = await Canvas.loadImage('./images/' + tierBleu[1] + '.png');
		context.drawImage(tier, w / 2, 0 + (h - hTier) / 2, wTier, hTier);
	}

	tier = await Canvas.loadImage('./images/' + tierRouge[0] + '.png');
	if(tierRouge.length == 1) {
		context.drawImage(tier, w + w / 2 - wTier / 2, 0 + (h - hTier) / 2, wTier, hTier);
	} else {
		context.drawImage(tier, w + w / 2 - wTier, 0 + (h - hTier) / 2, wTier, hTier);
		tier = await Canvas.loadImage('./images/' + tierRouge[1] + '.png');
		context.drawImage(tier, w + w / 2, 0 + (h - hTier) / 2, wTier, hTier);
	}
	
	let bleue = teams['bleue'];
	for(let i = 1; i < 6; i++) {
		let e = bleue[i - 1];
		background = await Canvas.loadImage('https://lolg-cdn.porofessor.gg/img/d/champion-banners/' + e['championId'] + '.jpg');
		context.drawImage(background, 0, h * i, w, h);

		tier = await Canvas.loadImage('./images/' + e['tier'] + '.png');
		context.drawImage(tier, w - wTier - offset, h * i + (h - hTier) / 2, wTier, hTier);

		summonerName = e['summonerName'];
		context.font = applyText(canvas, summonerName, textWidth);
		let height = parseInt(context.font.match(/\d+/), 10);
		context.fillStyle = '#ffffff';
		context.fillText(summonerName, 0 + offset / 4, h * i + h / 2 + height / 2);


	}

	let rouge = teams['rouge'];
	for(let i = 1; i < 6; i++) {
		let e = rouge[i - 1];
		background = await Canvas.loadImage('https://lolg-cdn.porofessor.gg/img/d/champion-banners/' + e['championId'] + '.jpg');
		context.drawImage(background, w, h * i, w, h);

		tier = await Canvas.loadImage('./images/' + e['tier'] + '.png');
		context.drawImage(tier, w + offset,  h * i + (h - hTier) / 2, wTier , hTier);

		summonerName = e['summonerName'];
		context.font = applyText(canvas, summonerName, textWidth);
		let height = parseInt(context.font.match(/\d+/), 10);
		context.fillStyle = '#ffffff';
		context.fillText(summonerName, w * 2 - offset / 4 - context.measureText(summonerName).width, h * i + h / 2 + height / 2);
	}

	return canvas;
}

function applyText(canvas, text, width) {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 100;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 3}px Dela`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > width);

	// Return the result to use in the actual canvas
	return context.font;
};

function teamTier(team) {
	let score = 0;
	let champToPoint = {'S':5, 'A':4, 'B':3, 'C':2, 'D':1};
	team.forEach(e => {
		let champion = getChampion(e['championId']);
		if(champion == 'MonkeyKing') champion = 'Wukong';
		let tier = tierList[champion];
		score += champToPoint[tier];
	});
	return getTeamTier(score);
}